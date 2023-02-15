const { parentPort } = require("node:worker_threads");
const https = require("https");

// parentPort.postMessage(`Start workers ${process.pid}\n`);
process.stdout.write(`Start workers ${process.pid}\n`);
// Функция запроса к ресурсу Api и выдача результатов
const getData = async (uri) =>
    new Promise((resolve, reject) => {
        https.get(uri, (res) => {
            process.stdout.write(uri);
            let data = "";
            // A chunk of data has been received.
            res.on("data", (chunk) => {
                data += chunk;
            });
            // The whole response has been received. Print out the result.
            res.on("end", () => {
                resolve(data);
            });
            res.on("error", (err) => {
                reject(err);
            });
        });
    });
// Функция фибоначи
const fib = (n) => {
    if (n < 2) {
        return n;
    }
    return fib(n - 1) + fib(n - 2);
};

parentPort.on("message", async (data) => {
    if (typeof data === "number") {
        process.stdout.write(`Start find number fibonacci for ${data}...\n`);
        const fibNumber = fib(data);
        process.stdout.write(`Number fibonacci for ${data} eq ${fibNumber} \n`);
        parentPort.postMessage(fibNumber);
    } else {
        const Data = await getData(data);
        parentPort.postMessage(Data);
    }
});
