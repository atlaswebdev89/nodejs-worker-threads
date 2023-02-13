const https = require("https");

process.stdout.write(`Start scripts request ${process.pid}`);
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
      process.stdout.write(data);
    });
  });
};
getData("https://sv-loft.by");
