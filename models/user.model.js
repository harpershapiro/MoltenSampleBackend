const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let User = new mongoose.Schema({
    user_name: {
        type: String
    },
    user_pass: {
        type: String,
        select: false
    },
    user_roles: {
        type: [],
        default: ['user']
    }

});

User.methods.findByUsername = (name, cb) => {
    return this.model('User').find({ username: name }, cb);
}

module.exports = mongoose.model('User', User);