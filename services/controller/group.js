var config = require('../../config/baseConfig.js');
var utility = require('../lib/utility.js');
var mysqlHelper = require('../lib/mysqlHelper.js');
var mysql=new mysqlHelper(config.basicSettings.currentDb);
var logger = require('../lib/logger.js');

/**
 * 查询当前用户所在系统的部门和部门下的所有子部门
 * @param params
 * @param cb
 */
function getGroupInfo(params,cb){
    var sql = 'CALL proc_get_core_group_bysys_userid(?,?)';
    mysql.executeQueryNoCache({sql: sql, params: params, cb: function (err, result) {
        if (cb) {
            cb(err, result);
        }
    }});
}

/**
 * 添加角色部门数据
 * @param params
 * @param cb
 */
function addGroupInfo(params,cb){
    var sql = 'CALL proc_add_core_group(?,?,?,?,?)';
    mysql.executeQueryNoCache({sql: sql, params: params, cb: function (err, result) {
        if (cb) {
            cb(err, result);
        }
    }});
}

/**
 * 修改角色部门数据
 * @param params
 * @param cb
 */
function updateGroupInfo(params,cb){
    var sql = 'CALL proc_update_core_group(?,?,?,?,?)';
    mysql.executeQueryNoCache({sql: sql, params: params, cb: function (err, result) {
        if (cb) {
            cb(err, result);
        }
    }});
}

/**
 * 删除角色部门数据
 * @param params
 * @param cb
 */
function deleteGroupInfo(params,cb){
    var sql = 'CALL proc_delete_core_group(?,?,?,?,?)';
    mysql.executeQueryNoCache({sql: sql, params: params, cb: function (err, result) {
        if (cb) {
            cb(err, result);
        }
    }});
}


/**
 * 获取组在所有模块中的权限
 * @param params
 * @param cb
 */
function getGroupModuleAction(params,cb){
    var sql = 'CALL proc_get_model_system_group_action(?,?)';
    mysql.executeQueryNoCache({sql: sql, params: params, cb: function (err, result) {
        if (cb) {
            cb(err, result);
        }
    }});
}

/**
 * 保存部门权限
 * 保存部门、模块、行为之间的关系
 * @param params
 * @param cb
 */
function addGroupAction(params,cb){
    var sql = 'CALL proc_add_core_group_module(?,?,?)';
    mysql.executeQueryNoCache({sql: sql, params: params, cb: function (err, result) {
        if (cb) {
            cb(err, result);
        }
    }});
}


/**
 * 查询当前用户所在系统的部门和部门下的所有子部门
 * 例如：params={systemId:2,userId:2}
 * @param req
 * @param res
 */
exports.getGroupInfo=function (req, res){
    var params = utility.parseParams(req), sqlParams = [],systemInfo=req.session.systemInfo;
    if (utility.isValidData(params.systemId)) {
        sqlParams.push(params.systemId);
    }
    else {
        sqlParams.push(systemInfo.systemId)
    }

    if (utility.isValidData(params.userId)) {
        sqlParams.push(params.userId);
    }
    else {
        sqlParams.push(systemInfo.userId);
    }

    getGroupInfo(sqlParams,callback)

    function callback(err, result) {
        var returnData={};
        if (err) {
            returnData=utility.jsonResult('获取数据失败!');
            logger.error({message: err.message, req: req, method: this.name});
        }
        else {
            returnData=utility.jsonResult(null,null,result[0],result[1].count);
        }
        res.send(returnData);
    }

}

/**
 * 添加或修改角色部门数据
 * @param req
 * @param res
 */
exports.editGroup=function (req, res){
    var params = utility.parseParams(req), sqlParams = [],systemInfo=req.session.systemInfo;
    if (utility.isValidData(params.id)) {
        sqlParams.push(params.id);
    }

    if (utility.isValidData(params.name)) {
        sqlParams.push(params.name);
    }
    else {
        return res.send(utility.jsonResult('名称不能为空!'));
    }


    if (utility.isValidData(params.state)) {
        sqlParams.push(params.state);
    }
    else {
        sqlParams.push(1);
    }

    if (utility.isValidData(params.parentId)) {
        sqlParams.push(params.parentId);
    }
    else {
        return res.send(utility.jsonResult('部门不能为空!'));
    }

    if (utility.isValidData(params.userId)) {
        sqlParams.push(params.userId);
    }
    else {
        sqlParams.push(systemInfo.userId);
    }


    if (utility.isValidData(params.systemId)) {
        sqlParams.push(params.systemId);
    }
    else {
        sqlParams.push(systemInfo.systemId)
    }

    //编辑
    if (utility.isValidData(params.id)) {
        updateGroupInfo(sqlParams,callback);
    }
    //添加
    else{
        addGroupInfo(sqlParams,callback);
    }

    function callback(err, result) {
        var returnData={};
        if (err) {
            returnData=utility.returnJson('保存数据失败!');
            logger.error({message: err.message, req: req, method: this.name});
        }
        else {
            returnData=utility.jsonResult(null,null,result[0],0);
        }
        res.send(returnData);
    }
}

/**
 * 根据id删除角色部门数据
 * 例如：params={systemId:2,id:2}
 * @param req
 * @param res
 * @returns {*}
 */
exports.deleteGroupInfo=function (req, res){
    var params = utility.parseParams(req), sqlParams = [],systemInfo=req.session.systemInfo;
    if (utility.isValidData(params.id)) {
        sqlParams.push(params.id);
    }
    else{
        return res.send(utility.jsonResult('Id不能为空!'));
    }

    if (utility.isValidData(params.systemId)) {
        sqlParams.push(params.systemId);
    }
    else {
        sqlParams.push(systemInfo.systemId)
    }

    function callback(err, result) {
        var returnData={};
        if (err) {
            returnData=utility.returnJson('删除数据失败!');
            logger.error({message: err.message, req: req, method: this.name});
        }
        else {
            returnData=utility.jsonResult(null,null,result[0],0);
        }
        res.send(returnData);
    }
}


/**
 * 获取用户在所有模块中的权限
 * @param req
 * @param res
 * @returns {*}
 */
exports.getGroupModuleAction=function (req, res){
    var params = utility.parseParams(req), sqlParams = [],systemInfo=req.session.systemInfo;

    if (utility.isValidData(params.systemId)) {
        sqlParams.push(params.systemId);
    }
    else {
        sqlParams.push(systemInfo.systemId)
    }

    if (utility.isValidData(params.groupId)) {
        sqlParams.push(params.groupId);
    }
    else{
        return res.send(utility.jsonResult('部门id不能为空!'));
    }

    getGroupModuleAction(sqlParams,callback);

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

/**
 * 保存部门权限
 * 保存部门、模块、行为之间的关系
 * @param req
 * @param res
 */
exports.addGroupPermission=function (req, res){
    var params = utility.parseParams(req), sqlParams = [],systemInfo=req.session.systemInfo,insertAction="",actions;

    if (utility.isValidData(params.systemId)) {
        sqlParams.push(params.systemId);
    }
    else {
        sqlParams.push(systemInfo.systemId)
    }

    if (utility.isValidData(params.groupId)) {
        sqlParams.push(params.groupId);
    }
    else{
        return res.send(utility.jsonResult('部门id不能为空!'));
    }

    if (utility.isValidData(params.actions)) {
        actions = JSON.parse(params.actions)
    }
    else{
        actions=[];
    }

    for(var i=0;i<actions.length;i++) {
        var row = actions[i];
        if (insertAction == "") {
            insertAction = "(" + sqlParams[0] + "," + sqlParams[1] + "," + row.moduleId + "," + row.id + ",'" + row.showName + "')";
        }
        else {
            insertAction += ",(" + sqlParams[0] + "," + sqlParams[1] + "," + row.moduleId + "," + row.id + ",'" + row.showName + "')";
        }
    }

    sqlParams.push(insertAction);

    addGroupAction(sqlParams,callback);

    function callback(err, result) {
        var returnData = {};
        if (err) {
            returnData = utility.returnJson('保存数据失败!');
            logger.error({message: err.message, req: req, method: this.name});
        }
        else {
            returnData = utility.jsonResult(null, null, result[0], 0);
            var returntext = result[0][0].returntext;
            if (returntext == "1") {
                returnData = utility.jsonResult(null, "保存成功", returntext, 0);
            }
            else {
                returnData = utility.jsonResult("保存数据失败");
            }
        }
        res.send(returnData);
    }
}

