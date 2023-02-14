module.exports = async function (input) {
  const sharp = require("sharp");
  const { src, height, width } = input;
  const [filename, ext] = src.toString().split(".");
  console.log(`Resizing ${src} to ${width}px wide`);
  for (let i = 0; i < 5e10; i++) {}
  (async () => {
    await sharp(src)
      .resize(width, height, { fit: "cover" })
      .toFile(`${src}-${width}.${ext}`);
  })();
};
