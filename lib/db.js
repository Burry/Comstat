var assert = require('assert');
var moment = require('moment');
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
        var today = moment();
        var month = today.month() + 1;
        var year = today.year();
        var firstOfMonth = today.startOf('month').date();
        var lastOfMonth = today.endOf('month').date();

        db.collection('usageData').aggregate([
            {
                $match: {
                    d: {$gte: firstOfMonth, $lte: lastOfMonth},
                    m: month,
                    y: year
                }
            },
            {
                $group: {
                    _id: {
                        d: {$max: "$d"},
                        m: {$max: "$m"}
                    },
                    totalUsed: {$last: "$totalUsed"}
                }
            },
            {
                $sort: {
                    _id : 1
                }
            }
        ], function(err, data) {
            if (err) console.log(err);
            cb(data);
        });
    })
}

var setUseData = function(useData, cb) {
    var today = moment();
    var day = today.date();
    var month = today.month() + 1;
    var year = today.year();
    var dateString = today.format('M/D');

    var data = {
        d: day,
        m: month,
        y: year,
        dateString: dateString,
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
        db.collection('comcastAccount').findOne(function(err, doc) {
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


// TESTING FUNCTIONS
function purgeDb(cb) {
    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection('comcastAccount').drop();
        db.collection('usageData').drop();
        db.close(function() {
            if (cb) cb();
        })
    })
}
function fillTestData(cb) {
    var accountData = {username:'test user', password:'test pass', dataCap: '1024'};
    var usageData = [];
    var today = moment();
    var month = today.month() + 1;
    var year = today.year();
    var runningTotal = 3;

    mongo.connect(url, function(err, db) {
        db.collection('comcastAccount').save(accountData, function(err, docs) {
            for (var i=0; i<31; i++) {
                runningTotal += (Math.floor(Math.random() * (45 - 3)) + 5);
                usageData.push({
                    d: i+1,
                    m: month,
                    y: year,
                    dateString: month + '/' + i + 1,
                    totalUsed: runningTotal
                });
            }
            db.collection('usageData').insertMany(usageData, function(err, docs) {
                if (err) console.log(err);
                db.close(function() {
                    if (cb) cb(docs);
                })
            })
        })
    })
}
// DESTROY DATABASE AND FILL WITH TEST DATA
// purgeDb(function() {
//     fillTestData(function() {
//     });
// });

startDb();


module.exports = {
    setUseData: setUseData,
    getLastUseData: getLastUseData,
    getDailyUseData: getDailyUseData,
    setComcastAccount: setComcastAccount,
    getComcastAccount: getComcastAccount,
}
