var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongo = require('./middleware/mongoConnect');
var app = express();
const hbs = require('hbs');

// view engine setup
app.set('views', path.join(__dirname, 'pages'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(mongo());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send(err.message);
});

require('./routes')(app);

hbs.registerPartials(path.join(__dirname, 'blocks'));

module.exports = app;
