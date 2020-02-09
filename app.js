var express = require('express'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    Student = require("./models/student"),
    Startup = require("./models/startup")

var mongoose = require('mongoose')
mongoose.connect("mongodb://localhost/internet-db")
    
var user = null;

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
    done(null, {id: user.id, type: user.type})
})

// passport.serializeUser(Student.serializeUser)
// passport.deserializeUser(Student.deserializeUser)

passport.deserializeUser(function(obj, done) {
    console.log("Test" + obj.id);
    switch (obj.type) {
        case 'student':
            Student.findById(obj.id)
                .then(user => {
                    if (user) {
                        done(null, user);
                    }
                    else {
                        done(new Error('user id not found:' + objid, null));
                    }
                });
            break;
        case 'startup':
            Startup.findById(obj.id)
                .then(device => {
                    if (device) {
                        done(null, device);
                    } else {
                        done(new Error('device id not found:' + obj.id, null));
                    }
                });
            break;
        default:
            done(new Error('no entity type:', obj.type), null);
            break;
    }
      
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
                type: 'student',
                image: req.body.image,
                email: req.body.email,
                grade: req.body.grade,
                skills: req.body.skills,
                resume: filename,
                location: null,}), req.body.password, function(err, student){
                    console.log(user)
                    if(err){
                        console.log(err)
                        return res.send("Signup error")
                    }
                    passport.authenticate("studentLocal")(req, res, function(){
                        user = student
                        // req.user = req.session.user
                        res.render("student_home.ejs", {
                            student: user
                        })
                    })
                })
            //res.redirect("/home/student")
        }
        
    });
    
})

app.get("/signup/startup", (req, res) => {
    res.sendFile("startup_signup.html", {root: "public"})
})

app.post("/signup/startup", (req, res) => {
    Startup.register(new Startup({username: req.body.username,
        password: req.body.password,
        type: 'startup',
        name: req.body.name,
        email: req.body.email,
        description: req.body.description,
        location: null,}), req.body.password, function(err, user){
            if(err){
                console.log(err)
                return res.send("Signup error")
            }
            passport.authenticate("startupLocal")(req, res, function(){
                //console.log(req.user.name)
                res.render("/home/startup")
            })
        })
})

app.get("/home/student", (req, res) =>{
    console.log(user)
    
    // Student.find({}, function(err, students){
    //     if(err){
    //         console.log("Error")
    //     } else{
    //         //console.log(students)
    //         res.render("student_home.ejs", {
    //             students: students
    //         })
    //     }
    // })
    
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
    user = req.user
    console.log(req.user.id)
    res.render("student_home.ejs", {
        student: req.user
    })
})

app.get('login/startup', (req, res) =>{
    res.render("startup_login.ejs")
})

