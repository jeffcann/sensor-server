module.exports = (function(host) {

    var Q = require("q");
    var MongoClient = require('mongodb').MongoClient;
    var assert = require('assert');
    var ObjectId = require('mongodb').ObjectID;
    host = host || "localhost";
    var db = null;

    function connect(callback, host) {
        var url = 'mongodb://' + host + ':27017/test';
        MongoClient.connect(url, function (err, connection) {
            assert.equal(null, err);
            assert.equal(false, !connection);
            db = connection;
            callback();
        });
    }

    function _find(collectionName, criteria, cb) {
        var cursor = db.collection(collectionName).find(criteria || {});

        var results = [];

        cursor.each(function(err, doc) {
            if(err) {
                cb(err, null);
            } else {
                if (doc != null) {
                    results.push(doc);
                } else {
                    cb(null, results);
                }
            }
        });
    }

    var _insertDocument = function(db, obj, collectionName, callback) {
        db.collection(collectionName).insertOne(obj, callback);
    };

    function add(sensorId, value) {
        return Q.promise(function(resolve, reject) {
            _insertDocument(db, {sensorId: sensorId, value:value, timestamp:new Date()}, "reading", function(err, resp) {
                if(err) {
                    reject(err);
                } else {
                    resolve(resp);
                }
            });
        });
    }

    function find(sensorId, cb) {
        _find("reading", {"sensorId":sensorId}, cb);
    }

    return {
        find: find,
        add: add,
        connect: connect
    };
})();

