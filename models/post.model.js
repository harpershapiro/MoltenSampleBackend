const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Post = new mongoose.Schema({
    post_url: {
        type: String
    },
    // post_img_url: {
    //     type: String
    // },
    img_ext:{
        type: String
    },
    pack_ext:{
        type: String
    },
    post_date: {
        type: String
    },
    post_submitter: {
        type: String
    },
    post_accepter: {
        type: String
    },
    post_title: {
        type: String
    },
    post_desc: {
        type: String
    },
    post_size: {
        type: Number
    }

});

module.exports = mongoose.model('Post', Post);

