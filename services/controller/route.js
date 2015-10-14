var system = require('./system.js');
var authenticate = require('./authenticate.js');
var utility = require('../lib/utility.js');
var config = require('../../config/baseConfig.js');
var path = require('path');
/**
 * 动态判断域名接口
 * */
exports.dynamicDomain = function (req, res) {
    var url = req.originalUrl.toString();
    var regArray = url.match(/\/([\w|\d]*)\/*/);
    var domain = regArray.length > 1 ? regArray[1] : undefined;
    var systemInfo = req.session.systemInfo;
    if (systemInfo && systemInfo.domain != domain) {
        utility.readFile(path.join(__dirname, config.expressStaticOption.path, config.expressStaticOption.login), function (err, result) {
            if (err) {
                res.send(err.message);
            } else {
                res.send(result);
            }
        });
        req.session.systemInfo=undefined;
    } else {
        if (domain) {
            authenticate.authenticate(req, res, function (result) {
                if (result) {
                    var indexPage=req.session.systemInfo.modules[0].url;//动态首页
                    utility.readFile(path.join(__dirname, config.expressStaticOption.path, indexPage), function (err, result) {
                        if (err) {
                            res.send(err.message);
                        } else {
                            res.send(result);
                        }
                    });
                } else {
                    utility.readFile(path.join(__dirname, config.expressStaticOption.path, config.expressStaticOption.login), function (err, result) {
                        if (err) {
                            res.send(err.message);
                        } else {
                            res.send(result);
                        }
                    });
                }
            });
        } else {
            var filePath = path.resolve(__dirname, config.expressStaticOption.path, config.expressStaticOption.error);
            utility.readFile(filePath, function (err, result) {
                if (err) {
                    res.send(err.message);
                } else {
                    res.send(result);
                }
            });
        }
    }
}


