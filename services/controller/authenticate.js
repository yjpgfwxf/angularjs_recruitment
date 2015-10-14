var utility = require('../lib/utility.js');
var config = require('../../config/baseConfig.js');
var mysqlHelper = require('../lib/mysqlHelper.js');
var mysql = new mysqlHelper(config.basicSettings.currentDb);
var logger = require('../lib/logger.js');
var moment = require('moment');
var redis = require('../lib/redisHelper.js');
var path = require('path');
/**
 * @fileOverview 认证类型
 * @description 登录认证
 * @author lml
 * @version 0.1
 */

/**
 * @description 登录
 * @params
 * @since version 0.1
 */
function login(params, cb) {
    var sql = 'call proc_authenticate_login(?,?,?,?,?,?,?,?)';
    mysql.executeQueryNoCache({sql: sql, params: params, cb: cb});
}
/**
 * @description 从session或者缓存中获取登录信息
 * @since version 0.1
 */
function getLoginInfo(req, res, cb) {
    var currentToken ='';
    var systemInfo = req.session ? req.session.systemInfo : '';
    if (typeof(systemInfo) == "object") {//会话还存在直接返回
        currentToken = systemInfo.token;
    }
    if (utility.isValidData(currentToken)) {
        redis.get(currentToken, function (err, result) {//从缓存中获取信心
            if (err) {
               console.log(err);
            } else {
                if (result) {
                    result = JSON.parse(result);
                    cb(result);
                } else {//从数据中查询
                    var host = req.host || '';
                    var ipsProxy = req.ips ? (req.ips.toString() == '' ? host : req.ips.toString()) : host;
                    var userAgent = req.get ? req.get('User-Agent') : '';
                    var userAgentKey=utility.getEncode({str: userAgent});
                    var tokenExpires = moment().add(config.tokenConfig.tokenSaveDays, 'day').utc().format('YYYY-MM-DD HH:mm:ss');
                    if (host && ipsProxy && userAgent) {
                        var sql = 'call proc_authenticate_token(?,?,?,?,?,?)';
                        var params = [currentToken, host, ipsProxy, userAgent,userAgentKey,tokenExpires];
                        mysql.executeQueryNoCache({sql: sql, params: params, cb: function (err, result) {
                            if (err) {
                                console.log(err);
                            } else {
                                if (result && result[0]) {
                                    console.log(result);
                                } else {
                                    cb(false);
                                }
                            }
                        }});
                    } else {
                        cb(false);
                    }
                }
            }
        });
    } else {
        cb(false);
    }
}

/**
 * @description 验证token
 * 返回值 true:验证登录，false：没有验证成功
 * @since version 0.1
 */
function authenticate(req, res, cb) {
    var callBack = function (result) {
        if (result) {
            req.session.systemInfo = result;//存session,cache
            if (cb) {
                cb(result);
            }
        } else {
            if (cb) {
                cb(result);
            }
        }
    }
    getLoginInfo(req, res, callBack);
}

/**
 * @description 登出
 * @since version 0.1
 */
function loginOut(req, res) {
    var callBack = function (result) {
        if (result) {
            var token = result.token;
            var userId = result.userId;
            redis.del(token);
            var sql = 'call proc_clean_token(?);';
            mysql.executeQueryNoCache({sql: sql, params: [userId], cb: function (err, result) {
                if (err) {
                   console.log(err);
                } else {
                    req.session.systemInfo=undefined;
                    res.send(utility.jsonResult('redirect', null, [], 0, config.expressStaticOption.login));
                }
            }});
        } else {
            res.send(utility.jsonResult('redirect', null, [], 0, config.expressStaticOption.login));
        }
    }
    getLoginInfo(req, res, callBack);
}
/*
* 获取token信息
* */
function getTokenInfo(req,res,cb){
    var systemInfo = req.session ? req.session.systemInfo : '';
    cb(systemInfo);
}
/**
 * @description 检查session
 * @since version 0.1
 */
function checkSession(req, res, next) {
    var systemInfo = req.session.systemInfo;//舆情系统信息
    var customerInfo=req.session.customerInfo;//舆情自助系统信息
    var url=req.url.split('?')[0];
     console.log('current url is:',url);
    if(customerInfo&&(customerInfo.userName=='demo'||customerInfo.userName.search('test')>0)){
        if(req.url.search('insert')>=0||req.url.search('delete')>=0||req.url.search('update')>=0)
            return res.send({"state":false,"message":"没有权限操作",data:[]});
    }
    if (url.search('api') > 0 || url.search('services') > 0) {
        if (systemInfo == undefined&&url.search('auto')<0) {
            res.send(utility.jsonResult('redirect', null, [], 0, config.expressStaticOption.login));
        } else if(customerInfo==undefined&&url.search('auto')>=0){
            res.send(utility.jsonResult('redirect', null, [], 0, config.expressStaticOption.autoLogin));
        }else {//记录日志
            next();
        }
    }else if(url.search('auto/register.html')>=0){
        if(customerInfo!=undefined){
           res.redirect('/auto/platform.html');
        }else{
            utility.readFile(path.join(__dirname, config.expressStaticOption.autoPath, config.expressStaticOption.autoRegister), function (err, result) {
                if (err) {
                    res.send(err.message);
                } else {
                    res.send(result);
                }
            });
        }
    }else if(url.search('auto/login.html')>=0){
        //如果是登录页面，并且token为null，session存在则跳转，否则进入登录页面
        if(customerInfo!=undefined && req.query.token==undefined){
            res.redirect('/auto/platform.html');
        }else{
            next();
        }
    }else {
        next();
    }
}

/**
 * 对外开放接口
 * */
 /**
 * @description 登录接口，无需验证验证码
 * @params {params:{"domain":"isentiment","userName":"Admin","userPwd":"123456"}}
 * @since version 0.1
 */
exports.login = function (req, res) {
    var params = utility.parseParams(req), condition = '', sqlParams = [];
    if (utility.isValidData(params.domain)) {
        sqlParams.push(params.domain);
    } else {
        return res.send(utility.jsonResult('domain不能为空!'));
    }
    if (utility.isValidData(params.userName)) {
        sqlParams.push(params.userName);
    } else {
        return res.send(utility.jsonResult('userName不能为空!'));
    }
    if (utility.isValidData(params.userPwd)) {
        sqlParams.push(utility.getEncode({str: params.userPwd}));
    } else {
        return res.send(utility.jsonResult('userPwd不能为空!'));
    }
    var host = req.host || '';
    sqlParams.push(host);
    var ipsProxy = req.ips ? (req.ips.toString() == '' ? host : req.ips.toString()) : host;
    sqlParams.push(ipsProxy);
    var userAgent = req.get ? req.get('User-Agent') : '';
    sqlParams.push(userAgent);
    sqlParams.push(utility.getEncode({str: params.userAgent}));
    var tokenExpires = moment().add(config.tokenConfig.tokenSaveDays, 'day').utc().format('YYYY-MM-DD HH:mm:ss');
    sqlParams.push(tokenExpires);
    var callBack = function (err, result) {
        if (err) {
            console.log(err);
        } else {
            //console.log(result);
            if (result[0]) {
                var loginInfo = result[0][0];
                if (loginInfo.login_status == 5) {//登录成功
                    var systemInfo = result[1][0] || {};
                    var modules = result[2]||[];
                    systemInfo.token = loginInfo.token;
                    systemInfo.modules = modules;
                    redis.set(loginInfo.token, JSON.stringify(systemInfo), config.redisSettings.expires);
                    req.session.systemInfo = systemInfo;
                    res.send(utility.jsonResult(null, null, {systemInfo:systemInfo}));
                }
                else {
                    res.send(utility.jsonResult(loginInfo));
                }
            }
        }
    }
    login(sqlParams, callBack);
}
/**
 * @description 登出接口
 * @since version 0.1
 */
exports.loginOut = function (req, res) {
    loginOut(req, res);
}
/**
 * @description 验证token获取刷新session,
 * @since version 0.1
 */
exports.authenticate = function (req, res, cb) {
    authenticate(req, res, cb);
}
/**
 * @description 检查session
 * @since version 0.1
 */
exports.checkSession = function (req, res, next) {
    checkSession(req, res, next);
}
/**
 * @description 404返回错误页面
 * @since version 0.1
 */
exports.notFound = function (req, res) {
    var filePath = path.resolve(__dirname, config.expressStaticOption.path, config.expressStaticOption.error);
    utility.readFile(filePath, function (err, result) {
        if (err) {
            res.send(err.message);
        } else {
            res.send(result);
        }
    });
}
/**
 * @description 获取session中Token
 * @since version 0.1
 */
exports.getToken=function(req,res){
    getTokenInfo(req,res,function(result){
        res.send(utility.jsonResult(null, null, {token:result.token}));
    })
}
