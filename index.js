import net from "net";
import readline from "readline";
import { exec, spawn } from "child_process";

let player = null;

function playMusic(link) {
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

const commands = {
  exit: (socket) => {
    socket.write("Bye!\r\n");
    socket.end();
  },
  update: (socket) => {
    exec("git -C ./iteam-workflow-improvment pull").addListener(
      "message",
      (msg) => socket.write(msg)
    );
  },
  "ya tobi brehala": () => {
    playMusic("./sounds/klavdia-petrivna-ya-tob-brehala.mp3");
  },
  hehe: () => {
    playMusic("./sounds/sinister-laugh.mp3");
  },
  fart: () => {
    exec("osascript -e 'set volume output volume 100'");
    playMusic(
      randomFromArray(
        new Array(4).fill(null).map((_, i) => `./sounds/fart-${i + 1}.mp3`)
      )
    );
  },
  "order 66": () => {
    exec("osascript -e 'set volume output volume 100'");
    playMusic("./sounds/test.mp3");
  },
  stop: () => {
    stopMusic();
  },
};

// test

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

    const command = commands[message];
    if (command) {
      command(socket);
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
