const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path')
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  });

var uploadsDir = require('path').join(__dirname,'../uploads'); 
router.use(express.static(uploadsDir));

function uploadLocal(){

}

function uploadRemote(){

}



router.post('/upload', function(req, res){
    
    if(!req.files||Object.keys(req.files).length===0){
        res.status(400).send('No files were uploaded.');
        return;
    }

    let uploadFile = req.files.file;
    let fileSize = req.files.file.size;
    let uploadPartialPath = req.body.filename;
    let uploadPath;

    console.log('req.files >>>', req.files); 

    uploadPath = __dirname + '/../uploads/' + uploadPartialPath;
    console.log(uploadPath)

    uploadFile.mv(uploadPath, function(err){
        if (err) {
            return res.status(500).send(err);
        }

        console.log(`uploads/${req.body.filename}`);
        res.json({file: `uploads/${req.body.filename}`, size: `${fileSize}`});
        
    });


});

router.route('/fetchImage/:file').get((req, res) => {
    let file = req.params.file;
    let fileLocation = path.join(`${uploadsDir}/images/`, file);
    console.log(`fetch image. filelocation: ${fileLocation}`)

    //res.send({image: fileLocation});
    res.sendFile(`${fileLocation}`)
})


router.get('/downloadPack/:file',(req,res)=>{
    let file = req.params.file;
    let fileLocation = path.join(`${uploadsDir}/packs/`, file);
    console.log(`download pack. filelocation: ${fileLocation}`);

    res.sendFile(`${fileLocation}`);
})

router.delete('/deleteImage/:file', (req, res) => {
    let file = req.params.file;
    let fileLocation = path.join(`${uploadsDir}/images/`, file);
    console.log("deleting " + fileLocation)
    fs.unlink(fileLocation, ()=> res.json('Image deleted.'));


})

router.delete('/deletePack/:file', (req, res) => {
    let file = req.params.file;
    let fileLocation = path.join(`${uploadsDir}/packs/`, file);
    console.log("deleting " + fileLocation)
    fs.unlink(fileLocation, ()=> res.json('Pack deleted.'));


})

module.exports = router; 