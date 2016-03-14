var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongo = require('./middleware/mongoConnect');
var app = express();

const hbs = require('hbs');
const cookieParser = require('cookie-parser');

// view engine setup
app.set('views', path.join(__dirname, 'pages'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(mongo());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.use((req, res, next) => {
    req.user = {};
    const hash = require('./lib/hash.js');
    var userId = req.cookies.id;
    var isLoggedIn;
    var name;
    if (userId) {
        isLoggedIn = hash.validate(userId);
        name = userId.split('.')[0];
    }
    if (isLoggedIn) {
        req.user.name = name;
    }
    next();
});

require('./routes')(app);

hbs.registerPartials(path.join(__dirname, 'blocks'));

module.exports = app;
