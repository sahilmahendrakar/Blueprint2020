var express = require('express'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    Student = require("./models/student"),
    Startup = require("./models/startup")

var app = express()
app.use(express.static(__dirname + '/public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(passport.initialize())
app.use(passport.session())
app.use(require('express-session')({
    secret: "Blueprint2020",
    resave: false,
    saveUninitialized: false,
}))

passport.use('studentLocal', new LocalStrategy(Student.authenticate()));
passport.use('startupLocal', new LocalStrategy(Startup.authenticate()));

passport.serializeUser((user, done) => {
    console.log(user)
    done(null, user.id)
})

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

var fs = require('fs')

var multer = require('multer')
var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './uploads');
    },
    filename: function (req, file, callback) {
      callback(null, file.originalname + '-' + Date.now() + '.pdf');
    }
  });
  var upload = multer({ storage : storage}).single('resume');

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))

var mongoose = require('mongoose')
mongoose.connect("mongodb://localhost/internet-db")



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
            var filename = null;
            try{
                filename = req.file.filename
            } catch(err){console.log(err)}
            //res.send("File Uploaded")
            console.log(req.file)
            Student.register(new Student({username: req.body.username,
                password: req.body.password,
                name: req.body.name,
                image: req.body.image,
                email: req.body.email,
                grade: req.body.grade,
                skills: req.body.skills,
                resume: filename,
                location: null,}), req.body.password, function(err, user){
                if(err){
                    console.log(err)
                    return res.send("Signup error")
                }
                passport.authenticate("local")(req, res, function(){
                    //console.log(req.user.name)
                    res.redirect("/home/student")
                })
                })
            //res.redirect("/home/student")
        }
        
    });
    
})

app.post("/signup/startup", (req, res) => {
    Startup.create({
        username: req.body.username,
        password: req.body.password,
        name: req.body.name,
        description: req.body.description,
        location: req.body.location,
    })
    res.redirect("/home/startup")
})

app.get("/home/student", (req, res) =>{
    Student.find({}, function(err, students){
        if(err){
            console.log("Error")
        } else{
            //console.log(students)
            res.render("student_home.ejs", {
                students: students
            })
        }
    })
    
})


app.get("/resume/:filename", function(req, res){
    var filename = req.params.filename
    console.log(filename)
    var tempFile="./uploads/" + filename;
    console.log(tempFile)
    fs.readFile(tempFile, function (err,data){
        if(err){
            console.log(err)
        }
        res.contentType("application/pdf");
        res.send(data);
  });
})

app.listen(8080, function(){
    console.log("Listening on Port 8080")
})

//LOGIN
app.get('/login/student', (req, res) => {
    res.render("student_login.ejs")
})

app.post('/login/student', passport.authenticate("studentLocal"), function(req, res){
    console.log(req.user.name)
    res.redirect("/home/student")
})


