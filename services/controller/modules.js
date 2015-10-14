var config = require('../../config/baseConfig.js');

var utility = require('../lib/utility.js');
var mysqlHelper = require('../lib/mysqlHelper.js');
var mysql = new mysqlHelper(config.basicSettings.currentDb);
var logger = require('../lib/logger.js');

/**
 * @fileOverview 模块管理类
 * @description
 * @author lml
 * @version 0.1
 */


function moduleQuery(params,cb){
 var sql='call proc_query_module(?,?)';
    mysql.executeQueryNoCache({sql: sql, params: params, cb: function (err, result) {
        if (cb) {
            cb(err, result)
        }
    }});
}

/**
 * 根据系统id获取模块及模块下的操作行为
 * @param params
 * @param cb
 */
function getModuleAction(params,cb){
    var sql='call proc_get_cfg_model_system_action(?)';
    mysql.executeQueryNoCache({sql: sql, params: params, cb: function (err, result) {
        if (cb) {
            cb(err, result)
        }
    }});
}

/**
 * 对外开放接口
 * */

exports.moduleQuery=function(req,res){
    var params = utility.parseParams(req), systemInfo = req.session.systemInfo, condition = '', sqlParams = [];
    if (utility.isValidData(params.systemId)) {
        sqlParams.push(parseInt(params.systemId));
    } else {
        if (systemInfo && systemInfo.systemId) {
            sqlParams.push(parseInt(systemInfo.systemId));
        } else {
            sqlParams.push(-1);
        }
    }
    if (utility.isValidData(params.userId)) {
        sqlParams.push(parseInt(params.userId));
    } else {
        if (systemInfo && systemInfo.userId) {
            sqlParams.push(parseInt(systemInfo.userId));
        } else {
            sqlParams.push(-1);
        }
    }
    moduleQuery(sqlParams, function (err, result) {
        if (err) {
            res.send(utility.jsonResult(err));
        } else {
            res.send(utility.jsonResult(null, null, result[0]));
        }
    });
}


/**
 * 根据系统id获取模块及模块下的操作行为
 * @param req
 * @param res
 */
exports.getModuleAction=function (req, res){
    var params = utility.parseParams(req), sqlParams = [],systemInfo=req.session.systemInfo;
    if (utility.isValidData(params.systemId)) {
        sqlParams.push(params.systemId);
    }
    else {
        sqlParams.push(systemInfo.systemId)
    }


    getModuleAction(sqlParams,callback)

    function callback(err, result) {
        var returnData={};
        if (err) {
            returnData=utility.returnJson('获取数据失败!');
            logger.error({message: err.message, req: req, method: this.name});
        }
        else {
            returnData=utility.jsonResult(null,null,result[0],0);
        }
        res.send(returnData);
    }

}