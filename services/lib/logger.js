var extend = require("extend");
var config = require("../../config/baseConfig.js");
var mysql = require("mysql");
var log4js=require("log4js");
log4js.configure(config.logServiceSettings);
/**
 * @fileOverview 日志类
 * @author lml
 * @version 0.1
 */
/**
 * @author lml
 * @constructor logger
 * @description 提供操作日志方法
 * @since version 0.1
 */
var logger = function (params) {
    this.config = params ? params : config.basicSettings.currentDb;
    this.pool = mysql.createPool(this.config);
};
logger.prototype.type = {info: "info", error: "error"};
/**
 * @description 操作数据
 * @param {object} params
 * @since version 0.1
 */
logger.prototype.executeQueryNoCache=function(params){
    var that = this;
    var options = {sql: "", params: [], cb: function (err, result) {
        if (err) {
            console.error(err);
        } else {
            console.error('there is no callback')
        }
    }};
    if (typeof(params) != "object") {
        return;
    } else {
        options = extend({}, options, params);
        that.pool.query(options.sql, options.params, function (err, res) {
            options.cb(err, res);
        });
    }
}
/**
 * @description 更新日志
 * @param  params:[]
 * @since version 0.1
 */
logger.prototype.updateLog=function(params,cb){
    var that=this;
    var sql = "call proc_add_core_log(?,?,?,?,?,?)";
    that.executeQueryNoCache({sql: sql, params: params, cb: function (err, result) {
        if(cb){
            cb(err, result);
        }
    }});
}
/**
 * @description 记录日志信息
 * @param {object} params 例如：={message:""};
 * @since version 0.1
 */
logger.prototype.info = function (params) {
    var that=this;
    var options = {message: "", dbObject: ''};
    options = extend({}, options, params);
    var sqlParams = [options.req&&options.req.url ? options.req.url : (options.method || ''), this.type.info, options.message.toString() || '', options.req&& options.req.get ? options.req.get('User-Agent') : '', options.req&&options.req.host ? options.req.host : '',options.req&&options.req.ips?options.req.ips:''];
    if (config.basicSettings.logger) {
        //console.log(sqlParams);
    } else {
      that.updateLog(sqlParams,function(err,result){
          if (err) {
              console.error(err);
          }
      });
    }

};
/**
 * @description 记录日志错误信息
 * @param {object} params 例如：={message:"",req:request,method:methodName,dbObject:[mysql]};
 * @since version 0.1
 */
logger.prototype.error = function (params) {
    var that=this;
    var options = {message: ""};
    options = extend({}, options, params);
    var sql = "call proc_add_core_log(?,?,?,?,?,?)";
    var sqlParams = [options.req&&options.req.url ? options.req.url : (options.method || 'local'), this.type.error, options.message.toString() || '', options.req&& options.req.get ? options.req.get('User-Agent') : '', options.req&&options.req.host ? options.req.host :'',options.req&&options.req.ips?options.req.ips:''];
    if (config.basicSettings.logger) {
        //console.log(sqlParams);
    } else {
        that.updateLog(sqlParams,function(err,result){
            if (err) {
                console.error(err);
            }
        });
    }
};
/**
 * @description log4js
 * @since version 0.1
 */
logger.prototype.log4js={
   consoleLogger:log4js.getLogger(),
   infoLogger:log4js.getLogger('infor'),
   errorLogger:log4js.getLogger('error'),
    info:function(msg){
        if(config.basicSettings.environment.search('dev')>0){
            this.consoleLogger.info(msg);
        }else{
           this.infoLogger.info(msg);
        }
    },
    error:function(msg){
        if(config.basicSettings.environment.search('dev')>0){
            this.consoleLogger.info(msg);
        }else{
            this.errorLogger.error(msg);
        }
    }
}

module.exports = new logger();