var mongoose = require('mongoose')
var passportLocalMongoose = require('passport-local-mongoose')

var StartupSchema = new mongoose.Schema({
    username: String,
    password: String,
    name: String,
    description: String,
    jobs: Array,
    location: String,
    email: String,
})

StartupSchema.plugin(passportLocalMongoose)

var Startup = new mongoose.model("Startup", StartupSchema)

module.exports = Startup