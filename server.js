const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('./node_modules/express-fileupload/lib/index');
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

app.use('/form', express.static(__dirname + '/index.html'));

app.use(fileUpload());

app.post('/upload', function(req, res){
    let sampleFile;
    let uploadPath;

    if(!req.files||Object.keys(req.files).length===0){
        res.status(400).send('No files were uploaded.');
        return;
    }

    console.log('req.files >>>', req.files); 

    sampleFile = req.files.sampleFile;

    uploadPath = __dirname + '/uploads/' + sampleFile.name;

    sampleFile.mv(uploadPath, function(err){
        if (err) {
            return res.status(500).send(err);
        }
        
        res.send('File uploaded to ' + uploadPath);
    });
});

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});

app.get('/', function(req, res){
    res.sendFile(__dirname+'/index.html');
})