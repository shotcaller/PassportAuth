var mongoose = require('mongoose')
var Schema = mongoose.Schema

var users = new Schema({
    //id : String,
    name : String,
    email : String,
    password : String

});

const User =  mongoose.model('User',users)

module.exports = User