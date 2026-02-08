const express = require("express");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "uploads/" });

ffmpeg.setFfmpegPath(ffmpegPath);

app.use(express.static("public"));

app.post("/convert", upload.single("video"), (req, res) => {
  const inputPath = req.file.path;
  const outputPath = `${req.file.path}.mp3`;

  ffmpeg(inputPath)
    .toFormat("mp3")
    .on("end", () => {
      res.download(outputPath, "converted.mp3", () => {
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);
      });
    })
    .on("error", () => res.status(500).send("Error"))
    .save(outputPath);
});

app.listen(3000, () => console.log("Server running"));
