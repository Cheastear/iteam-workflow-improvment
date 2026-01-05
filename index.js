import net from "net";
import readline from "readline";
import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import playerLib from "play-sound";
import loudness from "loudness";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const audio = playerLib();
let player = null;

async function setDeviceVolume(volume) {
  try {
    await loudness.setVolume(volume);
  } catch (err) {
    console.error("Failed to set volume:", err);
  }
}

function playMusic(link) {
  setDeviceVolume(100);
  if (player) return;

  player = audio.play(link, (err) => {
    if (err) console.error(err);
    player = null;
  });
}

function stopMusic() {
  if (player && player.kill) {
    player.kill();
    player = null;
  }
}

function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const commands = [
  {
    command: "exit",
    exec: (socket) => {
      socket.write("Bye!\r\n");
      socket.end();
    },
  },
  {
    command: "help",
    exec: (socket) => {
      commands.forEach((cmd) => socket.write(cmd.command + "\r\n"));
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
