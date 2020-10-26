const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Submission = new mongoose.Schema({
    submission_url: { //used for both image and pack
        type: String
    },
    img_ext:{
        type: String
    },
    pack_ext:{
        type: String
    },
    // submission_img_url: {
    //     type: String
    // },
    submission_title: {
        type: String
    },
    submission_user: {
        type: String
    },
    submission_date: {
        type: String
    },
    submission_desc: {
        type: String
    },
    submission_size: {
        type: Number
    }
});

module.exports = mongoose.model('Submission', Submission);