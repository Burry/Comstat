var assert = require('assert');
var engine = require("tingodb")({});
var db = new Engine.Db('./db', {});

var setComcastAccount = function(accountInfo, cb) {
    db.open(function(err, db) {
        db.collection('comcastAccount').save(accountInfo, function(err) {
            if (err) console.log(err);
            if (cb) cb();
        })
    })
}

var getComcastAccount = function(cb) {
    db.open(function(err, db) {
        db.collection('comcastAccount').findOne({_id: 1}, function(err, doc) {
            if (err) console.log(err);
            if (cb) cb(doc);
        })
    })
}

module.exports = {
    setComcastAccount: setComcastAccount,
    getComcastAccount: getComcastAccount
}
