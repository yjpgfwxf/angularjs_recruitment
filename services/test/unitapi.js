/**
 * Created by wang on 2015/5/20.
 */
var search = require('../controller/dataService.js');

var config={
    url:"http://127.0.0.1:10002/services/getQueryData"

};

//获取req 对象
function getReq(method,data){
    var req={};
    req.method=method;
    if(method=="GET"){
        req.query=data;
    }
    else {
        req.body=data;

    }
    return req;
}

//获取res对象
function getRes(cb){
    var res={};
    res.send=cb;
    return res;
}

//获取token
exports.getToken=function(token,cb){
    var req=getReq("GET",{token:token});
    var res=getRes(cb);
    req.headers={};
    req.headers['x-forwarded-for']="127.0.0.1";
    search.getToken(req, res);
};

exports.getQueryData=function(data,ip,cb){
   var req=getReq("post",data);
   if(ip!=undefined){
       req.headers={};
       req.headers['x-forwarded-for']=ip;
   }
   req.url=config.url;
   var res=getRes(cb);
    search.getQueryData(req, res);
};

exports.writelog=function(result){

}



//console.log(token);