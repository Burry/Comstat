var bodyParser = require('body-parser');
var childProcess = require('child_process').spawn;
var express = require('express');
var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var router = express.Router();

router.use(bodyParser.json());       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

function checkIfFile(file, cb) {
    fs.stat(file, function fsStat(err, stats) {
        if (err) {
            if (err.code === 'ENOENT') {
                return cb(null, false);
            } else {
                return cb(err);
            }
        }
        return cb(null, stats.isFile());
    });
}

function checkSecure(req) {
    var host = req.headers.host;
    if (req.secure ||
        host.includes('localhost') ||
        host.includes('127.0.0.1') ||
        host.includes('0.0.0.0') ||
        host.includes('::ffff:127.0.0.1') ||
        host.includes('::1'))
    { return true }
    else { return false }
}

/* GET home page. */
router.get('/', function(req, res, next) {
    var secure = checkSecure(req);

    checkIfFile('./db.sqlite3', function(err, isFile) {
        if (isFile) {
            res.render('index', {
                title: 'Comstat'
            });
        } else {
            res.render('setup', {
                title: 'Comstat » Setup',
                secure: secure
            });
        }
    });
});

/* GET python query to Comcast */
router.get('/response', function(req, res, next) {
    var username = req.app.get('username');
    var password = req.app.get('password');
    var comcastPy = childProcess('python3',[
        'comcast/comcast.py',
        username,
        password
    ]);
    comcastPy.stdout.pipe(res);
});

/* POST /config */
router.post('/config', function(req, res, next) {
    var db = new sqlite3.Database('./db.sqlite3');
    db.serialize(function() {
        db.run("CREATE TABLE loginDetails (info TEXT)");

        var stmt = db.prepare("INSERT INTO loginDetails VALUES (?)");
        stmt.run(req.body.username);
        stmt.run(req.body.password);
        stmt.run(req.body.data);
        stmt.finalize();

        db.each("SELECT rowid AS id, info FROM loginDetails", function(err, row) {
            console.log(row.id + ": " + row.info);
        });
    });
    db.close();
    res.redirect('/');
});

router.post


module.exports = router;
