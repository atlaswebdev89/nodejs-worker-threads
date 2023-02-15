const env = require("dotenv");
const { cpus } = require("node:os");
const { Worker, isMainThread } = require("node:worker_threads");
const http = require("http");

env.config();
const HOST = "0.0.0.0";
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
    return Promise.all(data);
};

const execApi = async (uri) => {
    workersPool.forEach((item) => item.postMessage(uri));
    // Промифицируем результаты
    const data = workersPool.map((item) => PromisifyWorker(item));
    return Promise.all(data);
};

if (isMainThread) {
    for (let i = 0; i < numCpus; i += 1) {
        createWorker(i);
    }

    const router = async (req, res) => {
        if (req.url === "/fib") {
            const jobs = await execFib(10);
            res.setHeader("Content-Type", "application/json");
            res.write(JSON.stringify(jobs));
            res.end();
        } else if (req.url === "/api") {
            const jobs = await execApi(
                "https://belarusbank.by/api/kursExchange"
            );
            res.setHeader("Content-Type", "application/json");
            res.write(JSON.stringify(jobs));
            res.end();
        } else if (req.url === "/loft") {
            const jobs = await execApi("https://sv-loft.by");
            res.setHeader("Content-Type", "application/json");
            res.write(JSON.stringify(jobs));
            res.end();
        } else {
            res.write("Hello");
            res.end("\n");
        }
    };

    http.createServer(router).listen(PORT, HOST, () => {
        process.stdout.write(`Server start in port ${PORT}\n`);
    });
} else {
    require("./worker-http-get-request");
}
