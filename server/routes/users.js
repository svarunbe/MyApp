var express = require('express');
var router = express.Router();
var mongo = require('../modules/mongoConnection.js');
var socket = require('../modules/socketConnection.js');

/* GET users listing. */
// Get users
router.get('/', (req, res) => {
    mongo.connection((db) => {
        db.collection('orders')
            .find()
            .toArray()
            .then((users) => {
                mongo.response.data = users;
                res.json(mongo.response);
                //res.send(users);
            })
            .catch((err) => {
                mongo.sendError(err, res);
            });
    });
});

module.exports = router;
