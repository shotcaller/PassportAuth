const LocalStrategy = require('passport-local').Strategy
const bcrypt =  require('bcrypt')
const mongoose = require('mongoose')
const User = require('./users')

function initialize(passport) {
       
    const authenticateUser = async (email, password, done) =>  {
    
        User.findOne({email : email})
            .then(user => {
                //Match User
                if(!user) {
                    return done(null ,false , {message :'Email is not registered.'});
                }

                //Match password
                bcrypt.compare(password,user.password, (err, isMatch) => {
                    if (err) throw err;

                    if(isMatch){
                        return done(null, user)
                    }else {
                        return done(null ,false, {message : "Password Incorrect"})
                    }
                });
            })
            .catch(err => console.log(err));

    }

    passport.use(new LocalStrategy({ usernameField :'email'},
    authenticateUser))

    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
 
    

}

module.exports = initialize