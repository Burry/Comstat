var assert = require('assert');
var mongo = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/comstat';  // Database URL

var dbConnect = function(cb) {
    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        cb(db);
        db.close();
    });
}

var getLastUseData = function(cb) {
    dbConnect(function(db) {
        db.collection('usageData').find()
            .sort({_id : -1})
            .limit(1)
            .toArray(function(err, doc) {
                if (err) console.log(err);
                if (doc && cb) cb(doc[0]);
            })
    })
}

var getDailyUseData = function(cb) {
    dbConnect(function(db) {
        var date = new Date();
        var y = date.getFullYear();
        var m = date.getMonth();
        var firstOfMonth = new Date(y, m, 0);
        var lastOfMonth = new Date(y, m + 1, 0);

        db.collection('usageData').aggregate([
            {
                $match: {
                    date: {
                        $gte: firstOfMonth, $lt: lastOfMonth
                    }
                }
            },
            {
                $group: {
                    _id: {$dayOfMonth: "$date"},
                    totalUsed: {$last: "$totalUsed"}
                }
            },
            {
                $sort: {
                    _id : 1
                }
            }
        ], function(err, data) {
            cb(data);
        });
    })
}

var setUseData = function(useData, cb) {
    var data = {
        date: new Date(),
        totalUsed: useData
    }

    dbConnect(function(db) {
        db.collection('usageData').save(data, function(err) {
            if (err) console.log(err);
            if (cb) cb(data);
        })
    })
}

var setComcastAccount = function(accountInfo, cb) {
    dbConnect(function(db) {
        db.collection('comcastAccount').save(accountInfo, function(err) {
            if (err) console.log(err);
            if (cb) cb();
        })
    })
}

var getComcastAccount = function(cb) {
    dbConnect(function(db) {
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

// TEST FUNCTIONS
function insertTestData() {
    var date = new Date();
    var runningTotal = 3;
    dbConnect(function(db) {
        var collection = db.collection('usageData');
        for (var i=0; i<=31; i++) {
            runningTotal += (Math.floor(Math.random() * (50 - 5)) + 5);
            var data = {
                date: new Date(date.getFullYear(), date.getMonth(), i+1),
                totalUsed: runningTotal
            }
            collection.insert(data, function(err, docs) {
                if (err) console.log(err);
            });
        }
    })
}

function purgeData() {
    dbConnect(function(db) {
        db.collection('usageData').drop();
    })
}

startDb();

//purgeData();
//insertTestData();

module.exports = {
    setUseData: setUseData,
    getLastUseData: getLastUseData,
    getDailyUseData: getDailyUseData,
    setComcastAccount: setComcastAccount,
    getComcastAccount: getComcastAccount,
}
