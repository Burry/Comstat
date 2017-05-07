var assert = require('assert');
var engine = require("tingodb")({});
var db = new engine.Db('./db', {});


var getUseData = function(numDocs, cb) {
    db.open(function(err, db) {
        db.collection('usageData').find()
            .sort({_id : -1})
            .limit(numDocs)
            .toArray(function(err, doc) {
                if (doc) doc = numDocs == 1 ? doc[0] : doc;
                if (err) console.log(err);
                if (doc && cb) cb(doc);
        })
    })
}

var setUseData = function(useData, cb) {
    var data = {
        date: new Date(),
        totalUsed: useData
    }

    // getUseData(1, function(doc) {
	// 	var dayDiff = Math.round(Math.abs((data.date.getTime() - doc.date.getTime())/(24*60*60*1000)));
    //     data.dayUsed = dayDiff >= 1 ? useData - doc.dayUsed : null;
    // })

    db.open(function(err, db) {
        db.collection('usageData').save(data, function(err) {
            if (err) console.log(err);
            if (cb) cb(data);
        })
    })
}

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

function startDb() {
    getComcastAccount(function(account) {
        if (account) {
            console.log("Logged into Comcast as " + account.username);
        } else {
            console.log("Welcome! Please load Comstat in a browser to get started.");
        }
    })
}

startDb();

module.exports = {
    setUseData: setUseData,
    getUseData: getUseData,
    setComcastAccount: setComcastAccount,
    getComcastAccount: getComcastAccount,
}
