var express = require('express');
var childProcess = require('child_process').spawn;
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var title = req.app.get('customTitle');
    var icon = req.app.get('customIcon');
    res.render('index', {
        title: title,
        icon: icon
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

module.exports = router;
