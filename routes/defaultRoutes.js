const express = require('express')
const router = express.Router()
const defaultController = require('../controllers/defaultController')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

const { User } = require('../models/userModel')

router.all('/', (req, res, next) => {
    req.app.locals.layout = 'main'
    next()
})


// router.get('/', defaultController.index)
router.route('/')
    .get(defaultController.index)

// Defining local strategy
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne({ email: email }).then(user => {
        if (!user) {
            return done(null, false, req.flash('error-message', 'User not found with this email, please try signing in...'))
        }
        bcrypt.compare(password, user.password, (err, passwordMatch) => {
            if (err) {
                return err
            }
            if (!passwordMatch) {
                return done(null, false, req.flash('error-message', 'Invalid password!! Please try again...'))
            }
            return done(null, user, req.flash('success-message', 'Login Successful..'))
        })
    });
}));

// used to serialize the user for the session
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});


router.route('/login')
    .get(defaultController.loginGet)
    .post(passport.authenticate('local', {
        successRedirect: '/admin',
        failureRedirect: '/login',
        failureFlash: true,
        successFlash: true,
        session: true
    }), defaultController.loginPost)
router.route('/register')
    .get(defaultController.registerGet)
    .post(defaultController.registerPost)

router.route('/post/:id')
    .get(defaultController.getSinglePost)
    .post(defaultController.submitComment)

router.get('/logout', (req,res) => {
    req.logOut()
    req.flash('success-message','Logout was successful...')
    res.redirect('/')
})

module.exports = router;
