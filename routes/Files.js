const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

var uploadsDir = require("path").join(__dirname, "../uploads");
router.use(express.static(uploadsDir));

//UPLOADS////////////////////////////////////////////////////////////////////////////////
router.post("/upload/remote", function (req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send("No files were uploaded.");
    return;
  }

  let uploadFile = req.files.file;
  let fileSize = req.files.file.size;
  let uploadPartialPath = req.body.filename;
  let uploadPath;
  let uploadType = uploadFile.mimetype;

  console.log("type: " + uploadFile.mimetype);
  console.log("req.files >>>", req.files);

  const params = {
    Bucket: "moltenbucket",
    Key: uploadPartialPath,
    Body: uploadFile.data,
  };

  s3.upload(params, (s3Err, data) => {
    if (s3Err) throw s3Err;
    console.log(`File uploaded at ${data.Location}`);
  });

  res.json({ file: `${req.body.filename}`, size: `${fileSize}` });
});

router.post("/upload/local", function (req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send("No files were uploaded.");
    return;
  }

  let uploadFile = req.files.file;
  let fileSize = req.files.file.size;
  let uploadPartialPath = req.body.filename;
  let uploadPath;
  let uploadType = uploadFile.mimetype;

  console.log("type: " + uploadFile.mimetype);
  console.log("req.files >>>", req.files);

  uploadPath = __dirname + "/../uploads/" + uploadPartialPath;
  console.log(uploadPath);

  uploadFile.mv(uploadPath, function (err) {
    if (err) {
      return res.status(500).send(err);
    }

    console.log(`uploads/${req.body.filename}`);
    res.json({ file: `uploads/${req.body.filename}`, size: `${fileSize}` });
  });
});

//FETCHING////////////////////////////////////////////////////////////////////////////////

router.route("/fetchImage/local/:file").get((req, res) => {
  let file = req.params.file;
  let fileLocation = path.join(`${uploadsDir}/images/`, file);
  console.log(`fetch image. filelocation: ${fileLocation}`);

  //res.send({image: fileLocation});
  res.sendFile(`${fileLocation}`);
});

router.get("/downloadPack/local/:file", (req, res) => {
  let file = req.params.file;
  let fileLocation = path.join(`${uploadsDir}/packs/`, file);
  console.log(`download pack. filelocation: ${fileLocation}`);

  res.sendFile(`${fileLocation}`);
});

router.route("/fetchImage/remote/:file").get((req, res) => {
  let file = req.params.file;
  let fileKey = `images/${file}`;
  var params = {
    Bucket: "moltenbucket",
    Key: fileKey,
  };
  //access bucket
  s3.getObject(params, (err, data) => {
    if (err) console.log(err, err.stack);
    else {
      let fileLocation = path.join(`${uploadsDir}/images/`, file);
      let image = data.Body;
      //write image to temp file and send
      fs.writeFile(fileLocation, image, (err) => {
        if (err) res.sendStatus(500);
        else {
          res.sendFile(`${fileLocation}`, (err) => {
            fs.unlink(fileLocation, () => console.log("Temp file deleted."));
          });
        }
      });
    }
  });

  //res.send({image: fileLocation});
});

router.get("/downloadPack/remote/:file", (req, res) => {
  let file = req.params.file;
  let fileKey = `packs/${file}`;
  var params = {
    Bucket: "moltenbucket",
    Key: fileKey,
  };

  //access bucket
  s3.getObject(params, (err, data) => {
    if (err) console.log(err, err.stack);
    else {
      let fileLocation = path.join(`${uploadsDir}/packs/`, file);
      let pack = data.Body;
      //write pack to temp file and send
      fs.writeFile(fileLocation, pack, (err) => {
        if (err) res.sendStatus(500);
        else {
          res.sendFile(`${fileLocation}`, (err) => {
            fs.unlink(fileLocation, () => console.log("Temp file deleted."));
          });
        }
      });
    }
  });

  //res.sendFile(`${fileLocation}`);
});

//DELETING////////////////////////////////////////////////////////////////////////////////

router.delete("/deleteImage/local/:file", (req, res) => {
  let file = req.params.file;
  let fileLocation = path.join(`${uploadsDir}/images/`, file);
  console.log("deleting " + fileLocation);
  fs.unlink(fileLocation, () => res.json("Image deleted."));
});

router.delete("/deletePack/local/:file", (req, res) => {
  let file = req.params.file;
  let fileLocation = path.join(`${uploadsDir}/packs/`, file);
  console.log("deleting " + fileLocation);
  fs.unlink(fileLocation, () => res.json("Pack deleted."));
});

router.delete("/deleteImage/remote/:file", (req, res) => {
  let file = req.params.file;
  let fileKey = `images/${file}`;
  var params = {
    Bucket: "moltenbucket",
    Key: fileKey,
  };
  s3.deleteObject(params, (err, data) => {
    if (err) console.log(err, err.stack);
    else res.json("Image deleted.");
  });
});

router.delete("/deletePack/remote/:file", (req, res) => {
  let file = req.params.file;
  let fileKey = `packs/${file}`;
  var params = {
    Bucket: "moltenbucket",
    Key: fileKey,
  };
  s3.deleteObject(params, (err, data) => {
    if (err) console.log(err, err.stack);
    else res.json("Pack deleted.");
  });
});

module.exports = router;
