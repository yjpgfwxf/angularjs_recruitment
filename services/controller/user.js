var config = require('../../config/baseConfig.js');

var utility = require('../lib/utility.js');
var mysqlHelper = require('../lib/mysqlHelper.js');
var mysql=new mysqlHelper(config.basicSettings.currentDb);
var logger = require('../lib/logger.js');

/**
 * 添加用户数据
 * @param params
 * @param cb
 */
function addUser(params,cb){
    var sql = 'CALL proc_add_core_user(?,?,?,?,?,?,?,?)';
    mysql.executeQueryNoCache({sql: sql, params: params, cb: function (err, result) {
        if (cb) {
            cb(err, result);
        }
    }});
}

/**
 * 编辑用户数据
 * @param params
 * @param cb
 */
function editUser(params,cb){
    var sql = 'CALL proc_update_core_user(?,?,?,?,?,?,?,?)';
    mysql.executeQueryNoCache({sql: sql, params: params, cb: function (err, result) {
        if (cb) {
            cb(err, result);
        }
    }});
}

/**
 * 删除数据接口
 * @param params
 * @param cb
 */
function deleteUser(params,cb){
    var sql = 'CALL proc_delete_core_user(?,?)';
    mysql.executeQueryNoCache({sql: sql, params: params, cb: function (err, result) {
        if (cb) {
            cb(err, result);
        }
    }});
}

/**
 * 获取用户在所有模块中的权限
 * @param params
 * @param cb
 */
function getUserModuleAction(params,cb){
    var sql = 'CALL proc_get_model_system_user_action(?,?)';
    mysql.executeQueryNoCache({sql: sql, params: params, cb: function (err, result) {
        if (cb) {
            cb(err, result);
        }
    }});
}

/**
 * 获取用户权限
 * @param params
 * @param cb
 */
function getUserPermission(params,cb){
    var sql = 'CALL proc_get_user_permission(?,?,?)';
    mysql.executeQueryNoCache({sql: sql, params: params, cb: function (err, result) {
        if (cb) {
            cb(err, result);
        }
    }});
}

/**
 * 获取用户数据接口
 * @param params
 * @param cb
 */
function getUserGroup(params,cb){
    var sql = 'CALL proc_get_core_user_group(?,?,?,?,?)';
    mysql.executeQueryNoCache({sql: sql, params: params, cb: function (err, result) {
        if (cb) {
            cb(err, result);
        }
    }});
}

/**
 * 保存用户权限
 * 保存用户、模块、行为之间的关系
 * @param params
 * @param cb
 */
function addUserAction(params,cb){
    var sql = 'CALL proc_add_core_user_action(?,?,?)';
    mysql.executeQueryNoCache({sql: sql, params: params, cb: function (err, result) {
        if (cb) {
            cb(err, result);
        }
    }});
}

/**
 * 添加、编辑用户数据
 * @param req
 * @param res
 * @returns {*}
 */
exports.addUser=function (req, res){
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

    if (utility.isValidData(params.password)) {
        sqlParams.push(params.password);
    }
    else {
        return res.send(utility.jsonResult('密码不能为空!'));
    }

    if (utility.isValidData(params.state)) {
        sqlParams.push(params.state);
    }
    else {
        sqlParams.push(1);
    }

    if (utility.isValidData(params.title)) {
        sqlParams.push(params.title);
    }
    else {
        return res.send(utility.jsonResult('职位不能为空!'));
    }

    if (utility.isValidData(params.phone)) {
        sqlParams.push(params.phone);
    }
    else {
        sqlParams.push('');
    }

    if (utility.isValidData(params.officePhone)) {
        sqlParams.push(params.officePhone);
    }
    else {
        sqlParams.push('');
    }

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

    //编辑
    if (utility.isValidData(params.id)) {
        editUser(sqlParams,callback);
    }
    //添加
    else{
        addUser(sqlParams,callback);
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
 * 删除数据接口
 * @param req
 * @param res
 * @returns {*}
 */
exports.deleteUser=function (req, res){
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

    deleteUser(sqlParams,callback);

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
 * 获取用户数据接口
 * @param req
 * @param res
 * @returns {*}
 */
exports.getUserGroup=function (req, res){
    var params = utility.parseParams(req), sqlParams = [],systemInfo=req.session.systemInfo;
    if (utility.isValidData(params.groupId)) {
        sqlParams.push(params.groupId);
    }
    else{
        return res.send(utility.jsonResult('部门id不能为空!'));
    }

    if (utility.isValidData(params.systemId)) {
        sqlParams.push(params.systemId);
    }
    else {
        sqlParams.push(systemInfo.systemId)
    }

    if (utility.isValidData(params.searchText)) {
        sqlParams.push(params.searchText);
    }
    else {
        sqlParams.push('')
    }

    if (utility.isValidData(params.pageNo)) {
        sqlParams.push(params.pageNo);
    }
    else {
        sqlParams.push(1)
    }

    if (utility.isValidData(params.pageSize)) {
        sqlParams.push(params.pageSize);
    }
    else {
        sqlParams.push(10)
    }


    getUserGroup(sqlParams,callback);

    function callback(err, result) {
        var returnData={};
        if (err) {
            returnData=utility.returnJson('删除数据失败!');
            logger.error({message: err.message, req: req, method: this.name});
        }
        else {
            returnData=utility.jsonResult(null,null,result[0],result[1].count);
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
exports.getUserModuleAction=function (req, res){
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
    else{
        return res.send(utility.jsonResult('用户id不能为空!'));
    }

    getUserModuleAction(sqlParams,callback);

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
 * 获取用户权限
 * @param req
 * @param res
 */
exports.getUserPermission=function (req, res){
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
    else{
        sqlParams.push(systemInfo.userId)
    }

    if (utility.isValidData(params.modelId)) {
        sqlParams.push(params.modelId);
    }
    else{
        sqlParams.push(-1)
    }

    getUserPermission(sqlParams,callback);

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
 * 保存用户权限
 * 保存用户、模块、行为之间的关系
 * @param req
 * @param res
 */
exports.addUserPermission=function (req, res){
    var params = utility.parseParams(req), sqlParams = [],systemInfo=req.session.systemInfo,insertAction="",actions;

    if (utility.isValidData(params.systemId)) {
        sqlParams.push(params.systemId);
    }
    else {
        sqlParams.push(systemInfo.systemId)
    }

    if (utility.isValidData(params.userId)) {
        sqlParams.push(params.userId);
    }
    else{
        sqlParams.push(systemInfo.userId)
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

    addUserAction(sqlParams,callback);

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