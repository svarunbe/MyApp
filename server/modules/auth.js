var Q = require('q');
let mongo = require('./mongoConnection.js');
var jwt    = require('jsonwebtoken'); 
var auth = {
    signUp: function(username, password) {
        var deferred = Q.defer();
        mongo.connection((db) => {
            var collection = db.collection('users');
            collection.insert({ "username": "test", 'password': 'test' })
                .then(function(result) {
                    if (result) {
                        deferred.resolve(result);
                    } else {
                        deferred.reject(new Error("Failed to add user")); //deferred.resolve(false);
                    }
                    db.close();
                })
        });

        return deferred.promise;
    },
    localAuth: function(username, password) {
        var deferred = Q.defer();

        mongo.connection((db) => {
            var collection = db.collection('users');

            collection.findOne({ 'username': username })
                .then(function(result) {
                    if (null == result) {
                        console.log("USERNAME NOT FOUND:", username);
                        deferred.reject(new Error("Failed to Login"));
                    } else {
                        var hash = result.password;
                        if (password == hash) {
                            const payload = {
                                admin: true
                            };
                            var token = jwt.sign({ foo: 'bar' }, 'shhhhh');

                            //if (bcrypt.compareSync(password, hash)) {
                            deferred.resolve({
                                success: true,
                                message: 'Enjoy your token!',
                                token: token
                            });
                        } else {
                            deferred.reject(new Error("AUTHENTICATION FAILED"));
                        }
                    }

                    db.close();
                });
        });

        return deferred.promise;
    }
}

module.exports = auth;