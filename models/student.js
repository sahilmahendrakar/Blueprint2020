var mongoose = require('mongoose')
var passportLocalMongoose = require('passport-local-mongoose')

var StudentSchema = new mongoose.Schema({
    username: String,
    password: String,
    name: String,
    image: String,
    email: String,
    grade: Number,
    skills: Array,
    resume: String,
    location: String,
})

StudentSchema.plugin(passportLocalMongoose)

var Student = new mongoose.model("Student", StudentSchema)

module.exports = Student