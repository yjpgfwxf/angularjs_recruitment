var cluster = require('cluster');
if (cluster.isMaster) {
    var cupCount = require('os').cpus().length;
    for (var i = 0; i < cupCount; i++) {
        cluster.fork();
    }
} else {
    var express = require('express');
    var app = express();
    var redis = require('redis');
    var bodyParser = require('body-parser');
    var cookieParser = require('cookie-parser');
    var session = require('express-session');
    var RedisStore = require('connect-redis')(session);

    var isJson = require('is-json');
    var config = require("./config/baseConfig.js");
    var apiRouter = require('./services/apiRouter.js');
    var authenticate = require('./services/controller/authenticate.js');
    app.use(bodyParser.json({limit: '10kb', strict: false}));
    app.use(bodyParser.urlencoded({ extended: false }));//Content-TYPE: application/X-www-form-urlencoded; CHARSET=UTF-8
    app.use(cookieParser(config.basicSettings.cookieSecret));
    var options={
        ttl:1000*60*60*4,
        client:redis.createClient(config.redisSettings.port, config.redisSettings.host),
        host:'127.0.0.1',
        port:'6379'
    };
    app.use(session({
        store: new RedisStore(options),
        key:'express.sid_s',
        resave: true,
        rolling: true,
        saveUninitialized: true,
        proxy: true,
        secret: config.basicSettings.cookieSecret,
        cookie: {
            maxAge: config.basicSettings.cookieAge }}));
    app.use("/", express.static(__dirname + '/public',config.expressStaticOption));
    //app.use(authenticate.checkSession);
    app.use("/", apiRouter);
    app.use("/*/r",express.static(__dirname + '/public'));
    app.use("/zp/js",express.static(__dirname + '/public/js'));
    app.use("/zp/style",express.static(__dirname + '/public/style'));
    app.use("/zp/img",express.static(__dirname + '/public/img'));
    app.use("/zp/favicon.ico",express.static(__dirname + '/public/favicon.ico'));

    app.use("/*", authenticate.notFound);

    app.listen(config.basicSettings.sitePort, function () {
        console.log('Express server listening on port ' + config.basicSettings.sitePort);
    });

}
cluster.on('exit', function (worker, code, signal) {
    console.log('worker %d died (%s). restarting...',
        worker.process.pid, signal || code);
    cluster.fork();
});
