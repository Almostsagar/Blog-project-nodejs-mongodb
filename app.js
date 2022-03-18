const { response } = require('express')
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const hbs = require('express-handlebars');
const fileUpload = require('express-fileupload')
const passport = require('passport')

const { selectOption } = require('./config/customFuns')
const { mongourl, PORT, globalVariables } = require('./config/config')
const { User } = require('./models/userModel')

const app = express()


// Configuring database - mongoose is going to be connected to mongodb
mongoose.connect(mongourl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(response => {
        console.log('mongodb connected successfully')
    }).catch(err => {
        console.log('db conn failed')
    })

// Configuring express
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(express.static(path.join((__dirname), '/public')))
app.set('views', './views');


// Configuring flash and session
app.use(session({
    secret: 'anysecret',
    saveUninitialized: true,
    resave: true
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(flash())

/* Use Global Variables */
app.use(globalVariables)


// Setup file upload for uploading image files
app.use(fileUpload())

// Setup viewengine to use handlebars
// app.engine('handlebars', hbs({ defaultLayout: 'default' }))

app.engine('handlebars', hbs({
    defaultLayout: 'main',
    helpers: { select: selectOption }
}));

app.set('view engine', 'handlebars')
var hbs2 = hbs.create({});

// register new function
hbs2.handlebars.registerHelper('substr', function (length, context) {
    if (context.length > length) {
        return context.substring(0, length) + "...";
    } else {
        return context;
    }
});
// Method override middleware
app.use(methodOverride('newMethod'))






// Configring routes
const defaultRoutes = require('./routes/defaultRoutes')
const adminRoutes = require('./routes/adminRoutes')
app.use('/', defaultRoutes)
app.use('/admin', adminRoutes)

// Listening on port
app.listen(PORT, () => {
    console.log(`server is running on p no 3000`)
})
