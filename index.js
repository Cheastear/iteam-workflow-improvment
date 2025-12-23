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

const server = net.createServer((socket) => {
  console.log("Client connected");
  socket.write("Welcome to Node Telnet Server\r\n> ");

  const rl = readline.createInterface({
    input: socket,
    output: socket,
    terminal: true,
  });

  rl.on("line", (line) => {
    const message = line.trim();
    console.log("Received:", message);

    if (message === "exit") {
      socket.write("Bye!\r\n");
      socket.end();
      return;
    }

    if (message === "fart") {
      exec("osascript -e 'set volume output volume 100'");
      playMusic(
        randomFromArray(
          new Array(4).fill(null).map((_, i) => `./sounds/fart-${i + 1}.mp3`)
        )
      );
    }

    if (message === "order 66") {
      exec("osascript -e 'set volume output volume 100'");
      playMusic("./sounds/test.mp3");
    }

    if (message === "stop") {
      stopMusic();
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
