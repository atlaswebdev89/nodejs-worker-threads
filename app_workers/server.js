const env = require("dotenv");
const Piscina = require("piscina");
const http = require("node:http");

env.config();
const HOST = "0.0.0.0";
const PORT = process.env.PORT || null;
if (PORT === null) {
  process.stdout.write("\nNot set port or not found .env file");
  process.exit();
}

const workerOne = "./app_workers/worker.js";
const workerTwo = "./app_workers/worker_second.js";
const workerThree = "./app_workers/resize-worker.js";

const poolWorkers = new Piscina();

const options = {
  filename: workerOne,
};
const optionsTwo = {
  filename: workerTwo,
};
const optionsThree = {
  filename: workerThree,
};
const router = async (req, res) => {
  try {
    if (req.url === "/fib") {
      const jobs = await poolWorkers.run({ data: 45 }, options);
      res.setHeader("Content-Type", "application/json");
      res.write(JSON.stringify(jobs));
      res.end("\n");
    } else if (req.url === "/api") {
      const jobs = await poolWorkers.run(100, optionsTwo);
      res.setHeader("Content-Type", "application/json");
      res.write(JSON.stringify(jobs));
      res.end("\n");
    } else if (req.url === "/rez") {
      const src = "/home/atlas/web/nodejs/http-workers/app_workers/images.jpg";
      const inputData = {
        src,
        height: 480,
        width: 640,
      };
      await poolWorkers.run(inputData, optionsThree);
      res.setHeader("Content-Type", "application/json");
      res.write(JSON.stringify("File images complete"));
      res.end("\n");
    } else {
      res.write("Hello");
      res.end("\n");
    }
  } catch (err) {
    res.writeHead(JSON.parse(err.message).statusCode);
    res.write(err.message);
    res.end("\n");
  }
};
const server = http.createServer(router);
server.listen(PORT, HOST, () => {
  process.stdout.write(`Start server in port ${PORT}. PID: ${process.pid}\n`);
});
