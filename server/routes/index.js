var express = require('express');
var router = express.Router();

/* GET home page. */
// Get users

router.get('/', function(req, res, next) {
  res.sendFile('./client/dist/index.html');
});

module.exports = router;
