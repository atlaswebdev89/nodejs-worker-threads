const { parentPort, workerData } = require("node:worker_threads");
const http = require("http");

parentPort.postMessage(`Start workers ${process.pid}`);
console.log(workerData.port);
const server = http
  .createServer((req, res) => {
    console.log("start");
  })
  .listen(workerData.port, () => {
    console.log(`Server starting in port ${workerData.port}`);
  });
