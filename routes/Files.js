const express = require('express');
const router = express.Router();

var uploadsDir = require('path').join(__dirname,'../uploads'); 
router.use(express.static(uploadsDir));

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