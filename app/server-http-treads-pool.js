const env = require("dotenv");
const { cpus } = require("node:os");
const { StaticPool } = require("node-worker-threads-pool");
const http = require("http");

env.config();
const HOST = "0.0.0.0";
const PORT = process.env.PORT || null;
if (PORT === null) {
  process.stdout.write("\nNot set port or not found .env file");
  process.exit();
}

const numCpus = cpus().length;
const workerScript = "./app/worker-http-get-request.js";

const createWorkerPool = () => {
  const pool = new StaticPool({
    size: numCpus - 1,
    task: workerScript,
    workerData: {},
  });
  return pool;
};

// Создаем пул воркеров
const pools = createWorkerPool();

const router = async (req, res) => {
  try {
    if (req.url === "/fib") {
      const jobs = await pools.exec(45);
      res.setHeader("Content-Type", "application/json");
      res.write(JSON.stringify(jobs));
      res.end("\n");
    } else if (req.url === "/api") {
      const jobs = await pools.exec("https://belarusbank.by/api/kursExchange");
      res.setHeader("Content-Type", "application/json");
      res.write(JSON.stringify(jobs));
      res.end();
    } else if (req.url === "/loft") {
      const jobs = await pools.exec("https://sv-loft.by");
      res.setHeader("Content-Type", "application/json");
      res.write(JSON.stringify(jobs));
      res.end();
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
// Start http server
const server = http.createServer(router);
server.listen(PORT, HOST, () => {
  process.stdout.write(`Server start in port ${PORT}. PID: ${process.pid}\n`);
});
