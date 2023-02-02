const { parentPort, workerData } = require("node:worker_threads");
const http = require("http");

const server = http
  .createServer((req, res) => {
    console.log("start");
  })
  .listen(workerData.port, () => {
    console.log(
      `Worker starting in port ${workerData.port}. Worker pid: ${process.pid}`
    );
  });
