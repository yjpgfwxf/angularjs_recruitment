/**
 * Created by blade on 2015/3/11.
 */
//var logger=require('../lib/logger.js');
var config=require("../../config/baseConfig.js");
var extend=require("extend");
//var mysqlHelper=new require('../lib/mysqlHelper.js').mysqlHelper;
//var mysql=new mysqlHelper(config.basicSettings.currentDb);
var auth=require('../controller/authenticate.js');
var system=require('../controller/system.js');

exports.getLogList=function(params){
var sql='select *from core_lo';
 if(params.noCache){
 mysql.executeQueryNoCache({sql:sql,cb:function(err,result){
     if(err) {
         console.log(err);
     }else{
         console.log(result);
     }
 }});
 }else{
     mysql.executeQuery({sql:sql,cb:function(err,result){
         if(err) {
             //logger.error({message:err,method:this.name,dbObject:mysql});
             //addLog({message:err,method:this.name});
         }else{
             console.log(result);
         }
     }});
 }
}
exports.updateLog=function(params){
    logger.error(params);
}
exports.login=function(req,res){
    auth.baseLogin(req,res);
}
exports.getBusinessSystemDb=function(params,cb){
    system.getBusinessSystemDb(params,cb);
}
var req={};
var res={};
function addLog(params){
    var options={message:""};
    options=extend({},options,params);
    var sql="call proc_add_core_log(?,?,?,?,?)";
    var sqlParams=[options.req?options.req.url:(options.method||''),'error',options.message.toString()||'',options.req?options.req.get('User-Agent'):'',options.req?options.req.host:(options.method||'')];
    options={sql:sql,params:sqlParams};
    if(config.basicSettings.logger){
        console.log(sqlParams);
    }else{
        mysql.ExecuteQueryNoCache({sql:sql,params:sqlParams,cb:function(err,result){
         if(err){
             console.error(err);
         }else{
            console.log(result);
         }
        }});
    }
}
/*
* 测试一 测试登录状态，Cookie: Cookie: clientToken=13eddb57-cd15-11e4-9774-4487fc705f0d
* get http://127.0.0.1:9999/
* get http://127.0.0.1:9999/map.html
* get http://127.0.0.1:9999/js/jQuery.js
*测试二 登录
* post http://127.0.0.1:9999/api/authenticate/login
* 参数 params={"systemAlias":"isentiment","userName":"admin","userPwd":"123456"}
*测试三 注册系统
* post http://127.0.0.1:9999/api/system/registerSystem
* 参数 params={"systemName":"测试系统","systemAlias":"testsystem11","systemDomain":"d3","systemFullName":"测试系统全名","dbIp":"115.28.205.176","dbName":"digital_marketing_business","dbUser":"root","dbPwd":"Pass@word1","dbConnectionLimit":"100","userName":"admin","userPwd":"123456","userTitle":"管理员"}
*测试四 修改用户（新增添加）
* post http://127.0.0.1:9999/api/user/updateUser
* 参数 params={"systemId":"14","userId":"8","userName":"admin23","userPwd":"123456","userTitle":"343.e3.34","userNotes":"34","userStatus":"1"}
* userId>0，修改，userId<0 新增
 * */