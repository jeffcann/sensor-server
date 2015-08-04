var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://192.168.2.201:27017/test';
var mongo = null;

var insertDocument = function(db, obj, collectionName, callback) {
    db.collection(collectionName).insertOne(obj, callback);
};

MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    mongo = db;
});

module.exports = function(obj, cb) {
    insertDocument(mongo, obj, "tick", cb);
};