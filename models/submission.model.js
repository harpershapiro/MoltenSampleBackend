const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Submission = new mongoose.Schema({
    submission_pack_url: {
        type: String
    },
    submission_img_url: {
        type: String
    },
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
    }
});

module.exports = mongoose.model('Submission', Submission);