const env = require("dotenv");
const { cpus } = require("node:os");
const { Worker, isMainThread } = require("node:worker_threads");
const http = require("http");

const workerScript = "./workers-http.js";

env.config();
const PORT = process.env.PORT || null;
if (PORT === null) {
  process.stdout.write("\nNot set port or not found .env file");
  process.exit();
}

const numCpus = cpus().length;
const workers = [];
if (isMainThread) {
  for (let i = 1; i < numCpus; i++) {
    const worker = new Worker(__filename, {
      workerData: { port: Number(PORT) + i, host: "0.0.0.0" },
    });
    workers.push(worker);
    worker.on("message", (msg) => {
      process.stdout.write(`${msg}\n`);
    });
    worker.on("error", (err) => {
      process.stdout.write(err);
    });
    worker.on("exit", (code) => {
      if (code !== 0) throw new Error(`Worker stopped with exit code ${code}`);
    });
  }

  const router = () => {
    
  }

  http.createServer(router).listen(PORT, () => {
    process.stdout.write(`Server start in port ${PORT}\n`);
  });
} else {
  const worker = require(workerScript);
}
