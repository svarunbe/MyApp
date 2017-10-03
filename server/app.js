var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
//var users = require('./routes/users');


var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client/dist')));

app.use('/', index);
//app.use('/orders', users);


var KiteConnect = require("kiteconnect").KiteConnect;
kiteControl = new KiteConnect("vbpw084agezv9xvp");

_global = {
    "access_token": "aej2fi6s8fhfb8estcvwd7mtx4acvdq2",
    "user_id": "",
    "public_token": "",
    "cronJob": [],
    "shares": {
      "sunpharma":"134327044",
      "purva":"136420100",
      "crompton":"4376065",
      "gmrinfra":"3463169"
    }
};


_cronRecord = [];
var shree= require('./strategies/init.js');
//shree.kiteLogin(_global.access_token);
// https://kite.trade/connect/login?api_key=vbpw084agezv9xvp
//var cronJob = require('./strategies/strategyCronJob.js');
//cronJob.startCronJob();


module.exports = app;