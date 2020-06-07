var express                 = require("express"),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    bodyParser              = require("body-parser"),
    User                    = require("./models/user")
    LocalStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose"),
    app                     = express();

mongoose.connect("mongodb://localhost/AuthApp");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
    secret: "Rusty is the best and cutest animal in the animal",
    resave: false,
    saveUnitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// =========
// ROUTES 
// =========

app.get("/", (req, res)=>{
    res.render("home")
});

app.get("/secret", isloggedin, (req, res)=>{
    res.render("secret")
});

// Auth Route

// show sign up form
app.get("/register", (req, res)=>{
    res.render("register");
});

// handling user sign up
app.post("/register", (req, res)=>{
    req.body.username
    req.body.password
    User.register(new User({username: req.body.username}), req.body.password, (err, user)=>{
        if(err){
            console.log(err);
            return("/register")
        }
        passport.authenticate("local")(req, res, ()=>{
            res.redirect("/secret");
        });
    });
});

// Login Route
// render login form
app.get("/login", (req, res)=>{
    res.render("login");
});

// login logic
// middleware
app.post("/login", passport.authenticate("local",{
    successRedirect: "/secret",
    failureRedirect: "/login"
}), (req, res)=>{

});


// logout logic
app.get("/logout", (req, res)=> {
    req.logout();
    res.redirect("/")
});

// function isloggedin
function isloggedin(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect("/login")
    }
}


app.listen(process.env.PORT=3000, ()=>{
    console.log("SERVER IS STARTED:...............")
});
