const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const moltenRoutes = express.Router(); //maybe rename as submissionRoutes
const fileUpload = require('./node_modules/express-fileupload/lib/index');
const submissionModel = require('./submission.model');
const PORT = 4000; //aka BACK_PORT in frontend 

let Submission = require('./submission.model');

app.use(cors());
app.use(bodyParser.json());

//DB connection
mongoose.connect('mongodb://127.0.0.1:27017/molten', {useNewUrlParser: true});
const connection = mongoose.connection;
connection.once('open', function(){
    console.log("MongoDB connection established successfully.");
})

//app.use('/form', express.static(__dirname + '/index.html'));

app.use(fileUpload());

//submission file upload
app.post('/upload', function(req, res){
    
    if(!req.files||Object.keys(req.files).length===0){
        res.status(400).send('No files were uploaded.');
        return;
    }

    let uploadFile = req.files.file;
    let uploadPath;

    console.log('req.files >>>', req.files); 

    uploadPath = __dirname + '/uploads/' + uploadFile.name;

    uploadFile.mv(uploadPath, function(err){
        if (err) {
            return res.status(500).send(err);
        }

        res.json({file: `uploads/${req.body.filename}`});
        
        res.send('File uploaded to ' + uploadPath);
    });
});

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});

//DB routes

//get all
moltenRoutes.route('/').get(function(req,res){
    Submission.find(function(err,submissions){
        if(err){
            console.log(err);
        } else {
            res.json(submissions);
        }
    });
});

//get one
moltenRoutes.route('/:id').get(function(req,res){
    let id = req.params.id;
    Submission.findbyId(id,function(err,submission){
        res.json(submission);
    });
});

//update one
moltenRoutes.route('/update/:id').post(function(req,res){
    let id = req.params.id;
    Submission.findbyId(id,function(err,submission){
        if(!submission){
            res.status(404).send("data is not found");
        } else {
            submission.submission_url = req.body.submission_url;
            submission.submission_title = req.body.submission_title; 
            submission.submission_user = req.body.submission_user;
            submission.submission_date = req.body.submission_date;
            submission.submission_desc = req.body.submission_desc;

            submission.save().then(submission => {
                res.json('Submission updated');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
        }
    });
});


moltenRoutes.route('/add').post(function(req,res){
    let submission = new Submission(req.body);

    submission.save()
        .then(submission => {
            res.status(200).json({'submission': 'Submission added successfully'});
        })
        .catch(err => {
            res.status(400).send('Adding new submission failed');
        });
});

app.use('/molten', moltenRoutes);





// app.get('/', function(req, res){
//     res.sendFile(__dirname+'/index.html');
// })