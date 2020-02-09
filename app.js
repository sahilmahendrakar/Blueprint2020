var express = require('express')
var app = express()
app.use(express.static(__dirname + '/public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

var multer = require('multer')
var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './uploads');
    },
    filename: function (req, file, callback) {
      callback(null, file.originalname + '-' + Date.now());
    }
  });
  var upload = multer({ storage : storage}).single('resume');

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))

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
    res.render("test.html")
})

app.get("/signup", function(req, res){
    res.sendFile("test.html", {root: "public"})
})

app.get("/signup/student", (req, res) => {
    res.sendFile("student_signup.html", {root: "public"})
})

app.post("/signup/student", (req, res) => {
    upload(req,res,function(err) {
        if(err) {
            res.send("error")
            console.log(err)
        } else{
            res.send("File Uploaded")
            console.log(req.file)
            Student.create({
                username: req.body.username,
                password: req.body.password,
                name: req.body.name,
                image: req.body.image,
                email: req.body.email,
                grade: req.body.grade,
                skills: req.body.skills,
                resume: req.file.filename,
                location: req.body.location,
            })
            // res.redirect("/home/student")
        }
        
    });
    
})

app.get("/home/student", (req, res) =>{
    Student.find({}, function(err, students){
        if(err){
            console.log("Error")
        } else{
            console.log(students)
            res.render("student_home.ejs", {
                students: students
            })
        }
    })
    
})


app.listen(8080, function(){
    console.log("Listening on Port 8080")
})

app.get("/resume", function(req, res){
    res.sendFile("resume_test.html", {root: "public"})
})

app.post("/resume", function(req, res){
    upload(req,res,function(err) {
        if(err) {
            res.send("error")
        }
        res.send("File is uploaded");
    });
})