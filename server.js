const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const ApiRouter = require('./routes/Api.js');

//const submissionRoutes = express.Router(); //maybe rename as submissionRoutes
//const postRoutes = express.Router(); //maybe rename as submissionRoutes

const fileUpload = require('./node_modules/express-fileupload/lib/index');
//const submissionModel = require('./models/submission.model');
const PORT = 4000; //aka BACK_PORT in frontend 

//let Submission = require('./models/submission.model');
//let Post = require('./models/post.model')

app.use(cors());
app.use(bodyParser.json());

//DB connection
mongoose.connect('mongodb://127.0.0.1:27017/molten', {useNewUrlParser: true});
const connection = mongoose.connection;
connection.once('open', function(){
    console.log("MongoDB connection established successfully.");
})

var uploadsDir = require('path').join(__dirname,'/uploads'); 
app.use(express.static(uploadsDir));

app.use(fileUpload());
app.use('/molten', ApiRouter)

//submission file upload
app.post('/upload', function(req, res){
    
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

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});


app.get('/fetchImage/:file', (req, res) => {
    let file = req.params.file;
    let fileLocation = require('path').join(`${uploadsDir}/images/`, file);
    console.log(`fetch image route. filelocation: ${fileLocation}`)

    //res.send({image: fileLocation});
    res.sendFile(`${fileLocation}`)
})


//app.get('/', function(req, res){
//     res.sendFile(__dirname+'/index.html');
// })