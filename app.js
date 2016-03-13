var app = require('express')();

app.use((req, res, next) => {
    req.user = {};
    const hash = require('./lib/hash.js');
    const cookieParser = require('cookie-parser');
    app.use(cookieParser());
    var userId = req.cookies.id;
    var isLogined = hash.validate(userId);
    var name = userId.parse('.')[0];
    if (isLogined) {
    	req.user.name = name;
    }
    next();
});

app.listen(80);
