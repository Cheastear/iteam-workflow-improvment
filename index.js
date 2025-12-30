import net from "net";
import readline from "readline";
import { exec, spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let player = null;

function playMusic(link) {
  exec("osascript -e 'set volume output volume 100'");
  if (player) return; // already playing

  player = spawn("afplay", [link]);

  player.on("exit", () => {
    player = null;
  });
}
function stopMusic() {
  if (player) {
    player.kill("SIGTERM"); // stop afplay
    player = null;
  }
}

function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// test

const commands = [
  {
    command: "exit",
    exec: (socket) => {
      socket.write("Bye!\r\n");
      socket.end();
    },
  },
  {
    command: "update",
    exec: (socket) => {
      exec(
        "git pull origin main",
        { cwd: __dirname },
        (err, stdout, stderr) => {
          if (err) {
            socket.write(`Error updating: ${err.message}\r\n> `);
            return;
          }
          socket.write(`Update output:\r\n${stdout}\r\n${stderr}\r\n> `);
        }
      );
    },
  },
  {
    command: "ya tobi brehala",
    exec: () => {
      playMusic("./sounds/klavdia-petrivna-ya-tob-brehala.mp3");
    },
  },
  {
    command: "hehe",
    exec: () => {
      playMusic("./sounds/sinister-laugh.mp3");
    },
  },
  {
    command: "fart",
    exec: () => {
      playMusic(
        randomFromArray(
          new Array(4).fill(null).map((_, i) => `./sounds/fart-${i + 1}.mp3`)
        )
      );
    },
  },
  {
    command: "stop",
    exec: () => {
      stopMusic();
    },
  },
];

const server = net.createServer((socket) => {
  console.log("Client connected");
  socket.write("Welcome to Node Telnet Server\r\n> ");

  const rl = readline.createInterface({
    input: socket,
    output: socket,
    terminal: true,
  });

  rl.on("error", (err) => {
    console.log("Readline error:", err.message);
    rl.close();
  });

  rl.on("line", (line) => {
    const message = line.trim();
    console.log("Received:", message);

    if (message === "help") {
      Object.keys(commands).forEach((cmd) => socket.write(cmd + "\r\n"));
    }

    const command = commands.find((c) => message.startsWith(c.command));
    if (command) {
      command.exec(socket);
    }

    socket.write("> ");
  });

  socket.on("error", (err) => {
    console.log("Socket error:", err.message);
    rl.close();
  });

  socket.on("close", (hadError) => {
    console.log("Socket closed", hadError ? "with error" : "");
    rl.close();
  });

  socket.on("end", () => {
    console.log("Client disconnected");
    rl.close();
  });
});

server.listen(2323, () => {
  console.log("Telnet server listening on port 2323");
});
