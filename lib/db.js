var assert = require('assert');
var engine = require('./dbEngine');
var db = engine.getDB();

var setComcastAccount = function(accountInfo, cb) {
    db.open(function(err, db) {
        db.collection('comcastAccount').save(accountInfo, function(err) {
            if (cb) cb();
        })
    })
}

var getComcastAccount = function(cb) {
    db.open(function(err, db) {
        db.collection('comcastAccount').findOne({_id: 1}, function(err, doc) {
            if (cb) cb(doc);
        })
    })
}

module.exports = {
    setComcastAccount: setComcastAccount,
    getComcastAccount: getComcastAccount
}
