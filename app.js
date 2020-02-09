var express = require('express')
var app = express()
app.use(express.static("public"));

var mongoose = require('mongoose')
mongoose.connect("mongodb://localhost/internet-db")

var studentSchema = new mongoose.Schema({
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

var startupSchema = new mongoose.Schema({
    username: String,
    password: String,
    name: String,
    description: String,
    jobs: Array,
    location: String,
})

var Student = new mongoose.model("Student", studentSchema)
var Startup = new mongoose.model("Startup", startupSchema)


app.get("/", function(req, res){
    res.render("index.html")
})


app.listen(8080, function(){
    console.log("Listening on Port 8080")
})