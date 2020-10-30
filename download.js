const fs = require("fs");
const Path = require("path");
const axios = require("axios");

async function download() {
  const url =
    "https://upload.wikimedia.org/wikipedia/commons/6/6a/Scotese_260_ma.png";
  const path = Path.resolve(__dirname, "./images", "permian.png");

  const response = await axios({
    method: "GET",
    url: url,
    responseType: "stream",
  });

  response.data.pipe(fs.createWriteStream(path));

  return new Promise((resolve, reject) => {
    response.data.on("end", () => {
      resolve();
    });

    response.data.on("error", (err) => {
      reject(err);
    });
  });
}

//download();
module.exports = download;
