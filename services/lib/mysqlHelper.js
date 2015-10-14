var mysql = require("mysql");
var config = require("../../config/baseConfig.js");
var extend = require("extend");
var redis = require('./redisHelper.js');
var utility = require('./utility.js');
 function mysqlHelper (params) {
    this.config = params ? params : config.basicSettings.currentDb;
    this.pool = mysql.createPool(this.config);
}
/**
 * @description 执行sql有缓存
 * @param {object} params 例如：{sql:"",params:[],expires:60*60*5,cb:function(err,result){}}
 * @since version 0.1
 */
mysqlHelper.prototype.executeQuery = function (params) {
    var that = this;
    var options = {sql: "", params: [], expires: 10, cb: function (err, result) {
        if (err) {
            //logger.error({message: err, method: that.name});
            return;
        } else {
            //logger.error({message: 'no callback function', method: that.name});
            return;
        }
    }};
    if (typeof params != 'object') {
        console.error('the type of params is not a object');
    } else {
        options = extend({}, options, params);
        if (options.sql.search(/update/i) >= 0 || options.sql.search(/insert/i) >= 0 || options.sql.search(/delete/i) >= 0) {
            that.pool.query(options.sql, options.params, function (err, res) {
                options.cb(err, res);
            });
        }
        var redisString = options.sql;
        if (options.params) {
            redisString += options.params.toString();
        }
        var redisKey = redis.createKey(redisString);
        redis.get(redisKey, function (err, value) {
            if (value != "" && value != null) {
                options.cb("", JSON.parse(value));
            } else {
                that.pool.query(options.sql, options.params, function (err, res) {
                    if (!err) {
                        redis.set(redisKey, JSON.stringify(res), options.expires || config.redisSettings.dataExpires);
                        options.cb(err, res);
                    } else {
                        options.cb(err, res);
                    }
                });
            }
        });
    }

}
/**
 * @description 执行sql无缓存
 * @param {object} params 例如：{sql:"",params:[],cb:function(err,result){}}
 * @since version 0.1
 */
mysqlHelper.prototype.executeQueryNoCache = function (params) {
    var that = this;
    var options = {sql: "", params: [], cb: function (err, result) {
        if (err) {
            //logger.error({message: err, method: that.name});
            return;
        } else {
            //logger.error({message: 'no callback function', method: that.name});
            return;
        }
    }};
    if (typeof(params) != "object") {
        console.error('the type of params is not a object');
    } else {
        options = extend({}, options, params);
        that.pool.query(options.sql, options.params, function (err, res) {
            options.cb(err, res);
        });
    }

}
module.exports=mysqlHelper;