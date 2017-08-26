/*mongo*/
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

// Connect
var connection = (closure) => {
    return MongoClient.connect('mongodb://localhost:27017/user', (err, db) => {
        if (err) return console.log(err);

        closure(db);
    });
};
var sendError = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

// Response handling
var response = {
    status: 200,
    data: [],
    message: null
};


module.exports = {
    'connection' :connection,
    'sendError':sendError,
    'response':response
};