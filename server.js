if(process.env.NODE_ENV !== 'production' ){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const initializePassport = require('./passport-config')
const flash =  require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const User = require('./users')

//Connecting MongoDB and creating model
mongoose.connect('mongodb://localhost:27017/passportauth', {useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected."))
    .catch(err => console.log(err));
 
initializePassport(passport)

// initializePassport(passport,
//      email => User.find({email : email},function(err,doc){ if(err){console.log(err)}else{console.log(doc)}}),
//     id => users.find(user => user.id === id))
                            

app.set('view-engine','ejs')
app.use(express.urlencoded({ extended : false}))
app.use(express.json());
app.use(flash())
app.use(session({
    secret : process.env.SESSION_SECRET,
    resave : false,
    saveUninitialized : false
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

//Main Page Route
app.get('/',checkAuthenticated,(req,res) =>{

    res.render('index.ejs', { name : req.user.name})

})

//Login Page Route
app.get('/login',checkNotAuthenticated, (req,res) => {

    res.render('login.ejs')
})

app.post('/login',checkNotAuthenticated,passport.authenticate('local',{
    successRedirect : '/',
    failureRedirect : '/login',
    failureFlash : true

}))

//Register Page Route
app.get('/register',checkNotAuthenticated,(req,res) => {

    res.render('register.ejs')
})

app.post('/register',checkNotAuthenticated, async (req,res) => {
    try{

        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        var user = new User({ 
             name : req.body.name,
             email : req.body.email,
             password : hashedPassword  });
user.save(function (err) {
  if (err) return handleError(err);
  // saved!
});
        res.redirect('/login')


    }catch {
            res.redirect('/register')
    }

    console.log(user)

})

//Logout Function Overrided
app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

//Session Authentication fucntions
function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }

    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect('/')
    }

    next()
}

//Server start
app.listen(6969)