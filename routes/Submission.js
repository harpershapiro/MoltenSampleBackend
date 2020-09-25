const express = require('express');
const router = express.Router();
const Submission = require('../models/submission.model');

//get all
router.route('/').get(function(req,res){
    Submission.find(function(err,submissions){
        if(err){
            console.log(err);
        } else {
            res.json(submissions);
        }
    });
});

//get one
router.route('/:id').get(function(req,res){
    let id = req.params.id;
    Submission.findbyId(id,function(err,submission){
        res.json(submission);
    });
});

//update one
router.route('/update/:id').post(function(req,res){
    let id = req.params.id;
    Submission.findById(id,function(err,submission){
        if(!submission){
            res.status(404).send("data is not found");
        } else {
            submission.submission_pack_url = req.body.submission_pack_url;
            submission.submission_img_url = req.body.submission_img_url;
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

router.route('/delete/:id').delete(function(req,res){
    let id = req.params.id;
    Submission.findByIdAndDelete(id,function(err,submission){
        if(!submission){
            res.status(404).send('data is not found');
        } else {
            res.json('Submission deleted.');
        }
    });
});


router.route('/add').post(function(req,res){
    let submission = new Submission(req.body);

    submission.save()
        .then(submission => {
            res.status(200).json({'submission': 'Submission added successfully'});
        })
        .catch(err => {
            res.status(400).send('Adding new submission failed');
        });
});

module.exports = router;