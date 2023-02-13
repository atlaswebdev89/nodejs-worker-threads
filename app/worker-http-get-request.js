const { parentPort } = require("node:worker_threads");
const https = require("https");

parentPort.postMessage(`Start workers ${process.pid}\n`);

// Функция запроса к ресурсу Api и выдача результатов
const getData = async (uri) => {
  https.get(uri, (res) => {
    console.log(uri);
    let data = "";
    // A chunk of data has been received.
    res.on("data", (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    res.on("end", () => {
      parentPort.postMessage(data);
    });
  });
};

parentPort.on("message", async (uri) => {
  if (typeof uri === "number") {
    throw new Error("param must be a string.");
  }
  await getData(uri);
});
