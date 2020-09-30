const express = require('express');
const router = express.Router();
const Post = require('../models/post.model');

router.route('/').get(function(req,res){
    Post.find(function(err,posts){
        if(err){
            console.log(err);
        } else {
            res.json(posts);
        }
    });
});

router.route('/:id').get(function(req,res){
    let id = req.params.id;
    Post.findbyId(id,function(err,post){
        res.json(post);
    });
});

//update one
router.route('/update/:id').post(function(req,res){
    let id = req.params.id;
    Post.findById(id,function(err,post){
        if(!post){
            res.status(404).send("data is not found");
        } else {
            post.post_pack_url = req.body.post_pack_url;
            post.post_img_url = req.body.post_img_url;
            post.post_date = req.body.post_date;
            post.post_submitter = req.body.post_submitter;
            post.post_accepter = req.body.post_accepter;
            post.post_desc = req.body.post_desc;

            post.save().then(post => {
                res.json('Post updated');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
        }
    });
});

router.route('/delete/:id').delete(function(req,res){
    let id = req.params.id;
    Post.findByIdAndDelete(id,function(err,post){
        if(!post){
            res.status(404).send('data is not found');
        } else {
            res.json('Post deleted.');
        }
    });
});

router.route('/add').post(function(req,res){
    let post = new Post(req.body);

    post.save()
        .then(post => {
            res.status(200).json({'post': 'Post added successfully'});
        })
        .catch(err => {
            res.status(400).send('Adding new post failed');
        });
});

module.exports = router;
