var config = require('../../config/baseConfig.js');
var utility = require('../lib/utility.js');
var mysqlHelper = require('../lib/mysqlHelper.js');
var mysql = new mysqlHelper(config.basicSettings.currentDb);
var logger = require('../lib/logger.js');
var async = require('async');
/**
 * @fileOverview 系统管理类
 * @description 注册系统以及相关配置
 * @author lml
 * @version 0.1
 */
/**
 * @description 获取业务系统
 * @param params:[],cb:callback
 * @since version 0.1
 */
function systemQuery(params,conditon,cb) {
    var sql='select *from vw_customer_system_admin where 1=1';
    if(utility.isValidData(conditon)){
        sql+=conditon;
    }
    mysql.executeQueryNoCache({sql: sql, params: params, cb: function (err, result) {
        if (cb) {
            cb(err, result)
        }
    }});
}
/**
 * @description 获取业务系统db信息
 * @param params:[],cb:callback
 * @since version 0.1
 */
function getBusinessSystemDb(params, cb) {
    var sql = 'call proc_get_system_db(?)';
    mysql.executeQuery({sql: sql, params: params, cb: function (err, result) {
        if (cb) {
            cb(err, result)
        }
    }
    });
}
function applySystem(params,cb){
    var sql='call proc_apply_system(?,?,?,?,?,?,?,?,?)';
    mysql.executeQueryNoCache({sql: sql, params: params,cb:cb});
}
function applyAPI(params,cb){
    var sql='call proc_apply_api(?,?,?,?,?,?)';
    mysql.executeQueryNoCache({sql: sql, params: params,cb:cb});
}
/**
 * @description 对外开放接口获取系统
 * @param req:request,res:respose,
 * @since version 0.1
 */
exports.systemQuery=function(params,cb){
    var sqlParams=[];
    var condition="";
    if(utility.isValidData(params.status)){
        sqlParams.push(params.status);
        condition+=" and status=?";
    }
    if(utility.isValidData(params.domain)){
        sqlParams.push(params.domain);
        condition+=" and domain=?";
    }
    systemQuery(sqlParams,condition,function(err,result){
        if(cb){
            cb(err,result);
        }
    });
}
/**
 * @description 对外开放接口获取系统
 * @param req:request,res:respose,
 * @since version 0.1
 */
exports.systemQueryByReq=function(req,res){
  var params=utility.parseParams(req),systemInfo=req.session.systemInfo;
    var sqlParams=[];
    var condition="";
    if(utility.isValidData(params.status)){
        sqlParams.push(params.status);
        condition+=" and status=?";
    }
    if(utility.isValidData(params.domain)){
        sqlParams.push(params.domain);
        condition+=" and domain=?";
    }
    if(utility.isValidData(systemInfo)){
        res.send(utility.jsonResult(null,null,[systemInfo,config.baseInfoSeting]));
    }else{
        systemQuery(sqlParams,condition,function(err,result){
            if(err){
                res.send(utility.jsonResult(err));
            }else{
                res.send(utility.jsonResult(null,null,[result[0],config.baseInfoSeting],result.length));
            }
        });
    }
}
/**
 * @description 对外开放接口获取业务数据库
 * @param req:request,res:respose,
 * @since version 0.1
 */
exports.getBusinessSystemDb = function (params, cb) {
    if (typeof params == 'object') {
        getBusinessSystemDb(params, function (err, result) {
            if (err) {
                if (cb) {
                    cb(err, result);
                }
            } else {
                if (result && result[0]) {
                    cb(err, result[0]);
                } else {
                    cb(false);
                }
            }
        });
    } else {
        cb(false);
    }
}

/**
 * 获取系统基本信息配置
 * @param req
 * @param res
 */
exports.getBaseInfoSettings=function(req,res){
    res.send(utility.jsonResult(null,null,config.baseInfoSeting,0));
}

/**
 * 获取用户信息，系统信息，系统模块
 * @param req
 * @param res
 */
exports.getSystemInfo=function(req,res){
    res.send(utility.jsonResult(null,null,req.session.systemInfo,0));
}
