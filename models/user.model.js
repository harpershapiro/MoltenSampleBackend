const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let User = new mongoose.Schema({
    user_name: {
        type: String
    },
    user_pass: {
        type: String
    },
    user_role: {
        
    }

});

module.exports = mongoose.model('User', User);