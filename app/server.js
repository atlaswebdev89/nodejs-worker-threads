const env = require("dotenv");
const { cpus } = require("node:os");
const { Worker, isMainThread } = require("node:worker_threads");
const http = require("http");

env.config();
const PORT = process.env.PORT || null;
if (PORT === null) {
    process.stdout.write("\nNot set port or not found .env file");
    process.exit();
}

const numCpus = cpus().length;
const workers = [];
if (isMainThread) {
    for (let i = 0; i < numCpus; i += 1) {
        const worker = new Worker(__filename, {
            workerData: "Hello",
        });
        workers.push(worker);
        worker.on("message", (msg) => {
            process.stdout.write(`${msg}\n`);
        });
        worker.on("error", (err) => {
            process.stdout.write(err);
        });
        worker.on("exit", (code) => {
            if (code !== 0)
                throw new Error(`Worker stopped with exit code ${code}`);
        });
    }
    const router = async (req, res) => {
        if (req.url === "/fib") {
            // res.write("Waiting data...");
            workers[0].postMessage(46);
            // worker.postMessage(4);
            workers[0].on("message", (msg) => {
                res.end(JSON.stringify(msg));
            });
        } else {
            res.write("Hello");
            res.end("\n");
        }
    };

    http.createServer(router).listen(PORT, () => {
        process.stdout.write(`Server start in port ${PORT}\n`);
    });
} else {
    require("./worker-http-get-request");
}
