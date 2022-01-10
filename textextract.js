const Tesseract = require("tesseract.js");
const path = require("path");
const fs = require("fs");
const { performance } = require("perf_hooks");

const sourceImageFolder = "KenyaPower_Care";

fs.readdir(`${__dirname}/images/${sourceImageFolder}`, async (err, files) => {
  /**
   * CREATE FOLDER IN TEXT DIRECTORY TO STORE THE EXTRACTED TEXTS
   */
  const targetTextFolder = path.resolve(
    `${__dirname}/text/${sourceImageFolder}`
  );
  if (!fs.existsSync(targetTextFolder)) {
    fs.mkdirSync(targetTextFolder);
  }
  const startTime = performance.now();
  /**
   * LOOP THROUGH THE SOURCE IMAGE FOLDER AND EXTRACT TEXT FOR EACH IMAGE
   */
  for (let i = 0; i < files.length; i++) {
    await Tesseract.recognize(
      path.resolve(`${__dirname}/images/${sourceImageFolder}`, `${files[i]}`),
      "eng"
    ).then(({ data: { text } }) => {
      const textPath = path.resolve(
        `${__dirname}/text/${sourceImageFolder}`,
        `${files[i].replace(".png", "")}.txt`
      );
      const writeStream = fs.createWriteStream(textPath);
      writeStream.write(text);
      console.log(`Done writing ${files[i]}`);
    });
  }
  const endTime = performance.now();
  console.log(`Text extraction took ${endTime - startTime} milliseconds`);
});
