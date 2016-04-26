'use strict';

const fs = require('fs');
const path = require('path');

const express = require('express');
const logger = require('morgan');
const hbs = require('hbs');
const layouts = require('handlebars-layouts');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();

const mongo = require('./middleware/mongoConnect');
const cookieAuthenticator = require('./middleware/cookieAuthenticator');
const renderLayout = require('./middleware/renderLayout');

// view engine setup
app.set('views', path.join(__dirname, 'pages'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongo());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(renderLayout());
app.use(cookieParser());
app.use(cookieAuthenticator());

require('./routes')(app);

hbs.registerPartials(path.join(__dirname, 'blocks'));

hbs.handlebars.registerHelper(layouts(hbs.handlebars));
hbs.handlebars.registerPartial('base', fs.readFileSync('./pages/base/base.hbs', 'utf8'));

module.exports.hbs = hbs;

module.exports = app;
