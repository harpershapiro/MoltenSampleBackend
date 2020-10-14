const express = require('express');
const router = express.Router();

var uploadsDir = require('path').join(__dirname,'../uploads'); 
router.use(express.static(uploadsDir));

router.post('/upload', function(req, res){
    
    if(!req.files||Object.keys(req.files).length===0){
        res.status(400).send('No files were uploaded.');
        return;
    }

    let uploadFile = req.files.file;
    let uploadPartialPath = req.body.filename;
    let uploadPath;

    console.log('req.files >>>', req.files); 

    uploadPath = __dirname + '/uploads/' + uploadPartialPath;

    uploadFile.mv(uploadPath, function(err){
        if (err) {
            return res.status(500).send(err);
        }

        console.log(`uploads/${req.body.filename}`);
        res.json({file: `uploads/${req.body.filename}`});
        
    });


});

router.route('/fetchImage/:file').get((req, res) => {
    let file = req.params.file;
    let fileLocation = require('path').join(`${uploadsDir}/images/`, file);
    console.log(`fetch image. filelocation: ${fileLocation}`)

    //res.send({image: fileLocation});
    res.sendFile(`${fileLocation}`)
})


router.get('/downloadPack/:file',(req,res)=>{
    let file = req.params.file;
    let fileLocation = require('path').join(`${uploadsDir}/packs/`, file);
    console.log(`download pack. filelocation: ${fileLocation}`);

    res.sendFile(`${fileLocation}`);
})

module.exports = router;