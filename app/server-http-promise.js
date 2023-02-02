const env = require("dotenv");
const { cpus } = require("node:os");
const { Worker, isMainThread } = require("node:worker_threads");
const http = require("http");

const workerScript = "./worker.js";

env.config();
const PORT = process.env.PORT || null;
if (PORT === null) {
  process.stdout.write("\nNot set port or not found .env file");
  process.exit();
}

const numCpus = cpus().length;
// Промифисицыруем результаты
const PromisifyWorker = (worker) =>
  new Promise((resolve, reject) => {
    worker.on("message", resolve);
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
// Создаем пул воркеров при старте скрипта
const workersPool = [];
const createWorker = async (dataWorker) => {
  const worker = new Worker(__filename, {
    workerData: dataWorker,
  });
  workersPool.push(worker);
  process.stdout.write(await PromisifyWorker(worker));
};

const execFib = async (number) => {
  // Запускаем все треды на выполнение функции фибоначи для числа 40
  workersPool.forEach((item) => item.postMessage(number));
  // Промифицируем результаты
  const data = workersPool.map((item) => PromisifyWorker(item));
  return await Promise.all(data);
};

if (isMainThread) {
  for (let i = 0; i < numCpus; i++) {
    createWorker(i);
  }

  const router = async (req, res) => {
    if (req.url === "/fib") {
      const jobs = await execFib(46);
      res.setHeader("Content-Type", "application/json");
      res.write(JSON.stringify(jobs));
      res.end();
    } else {
      res.write("Hello");
      res.end("\n");
    }
  };

  http.createServer(router).listen(PORT, () => {
    process.stdout.write(`Server start in port ${PORT}\n`);
  });
} else {
  const worker = require(workerScript);
}
