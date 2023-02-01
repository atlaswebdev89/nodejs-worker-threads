const { parentPort, workerData } = require("node:worker_threads");

parentPort.postMessage(`Start workers ${process.pid}`);

// Функция фибоначи
function fib(n) {
  if (n < 2) {
    return n;
  }
  return fib(n - 1) + fib(n - 2);
}
parentPort.on("message", (num) => {
  if (typeof num !== "number") {
    throw new Error("param must be a number.");
  }
  const result = fib(num);
  parentPort.postMessage(result);
});
