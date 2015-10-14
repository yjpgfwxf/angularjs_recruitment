var cryptp = require('crypto');
//var ccap = require('ccap');
var extend=require("extend");
var isJson=require('is-json');
var fs = require("fs");
/**
 * @fileOverview 通用工具
 * @author lml
 * @version 0.1
 */
/**
 * @author lml
 * @constructor utility
 * @description 创建utility对象
 * @since version 0.1
 */
var utility = function () {
};
/**
 * @author lml
 * @description 创建jsonResult={result:false,data:"",message:""}
 * @since version 0.1
 */
utility.prototype.jsonResult=function(){
    this.result=false;
    this.count=0;
    this.data={};
    this.message="";
}
/**
 * @author lml
 * @description 检查数据是否可用,不可用类型(undefined,"",null)
 * @param {object} data
 * @return {boolean} 布尔类型
 * @since version 0.1
 */
utility.prototype.isValidData = function (data) {
    return data !== undefined && data !== "" && data !== null;
};

/**
 * 检查是否是日期格式
 * @param data
 * @returns {boolean}
 */
utility.prototype.isValidDatetime=function(data){
    try{
        var d=new Date(data);
        if (d == "Invalid Date") {
            return false;
        }
        return true;

    }
    catch (e){
        return false;
    }
}

/**
 * @author lml
 * @description 编码字符串
 * @param {object} params 例如：{algorithm:'sha512',encoding:'hex',str:""}
 * @return {string} 字符串的编码值
 * @since version 0.1
 */
utility.prototype.getEncode = function (params) {
    var options={algorithm:'sha512',encoding:'hex',str:""};
    if(typeof params=='object'){
        options=extend({},options,params);
    }else{
        options.str=params;
    }

    var hash = cryptp.createHash(options.algorithm);
    return hash.update(options.str).digest(options.encoding);
};
/**
 * @author lml
 * @description 生成验证码
 * @param {object} params 例如：
 * @return {object} {verificationCode: ary[0], buffer: ary[1]}
 * @since version 0.1
// */
//utility.prototype.getVerificationCode = function (options) {
//    var params = {
//        width: 130,
//        height: 50,
//        offset: 30,
//        fontsize: 45,
//        quality: 100,
//        generate: function () {
//            var num = 4;
//            var codeSource = [
//                'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
//                'n', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
//                'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
//                'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
//            var codeText = '';
//            for (var i = 0; i < num; i++) {
//                var random = Math.floor(Math.random() * 49);
//                codeText += codeSource[random];
//            }
//            return codeText;
//        }
//    };
//    if (!this.isValidData(options)) {
//        params = options;
//    }
//    var ary = ccap(params).get();
//    return {verificationCode: ary[0], buffer: ary[1]};
//};
/**
 * @author lml
 * @description 解析json string 到 json object
 * @param {object} params 例如：
 * @return {object} json object
 * @since version 0.1
 */
utility.prototype.parseToJson=function(params){
    if (params) {
        if(!isJson(params,true)){
            return 'this is not a valid json string'
        }
        try{
            var paramsObj = typeof(params) == "object" ? params : JSON.parse(params);}catch(ex){
            return ex.message;
        }
        return paramsObj;
    }
    return params;
};

/**
 * @description 读取文件
 * @params path:路径，cb:回调函数，返回(err,result)
 * @since version 0.1
 */
utility.prototype.readFile=function(path,cb){
    fs.exists(path,function(result){
        if(result){
            fs.readFile(path,{encoding:'utf8'},function(err,result){
                if(cb){
                    cb(err,result)
                }
            });
        }else{
            console.error('the file path not exists:'+path);
        }
    });
}
/**
 * @description 解析get or post参数
 * @params req,request
 * @since version 0.1
 */
utility.prototype.parseParams= function (req) {
    var result = {};
    if (req.method == "GET") {
        for (var p in req.query) {
            result[p] = req.query[p];
        }
    }else if(req.method=='POST'){
        try {
            if(typeof req.body.params=='String'){
                result=JSON.parse(req.body.params);
            }else{
                result=req.body;
            }
        } catch (ex) {
            throw ex;
        }
    }
    return result;
}


/**
 * @author lml
 * @description 生成json object
 * @param err错误,message消息,data返回数据,count数量
 * @return {object} json object 例如：{result:"",data:"",message:""}
 * @since version 0.1
 */
utility.prototype.jsonResult = function (err,message,data,count,redirect) {
    var result = {};
    if(err)
    {
        result.state= false;
        result.message= message || err;
        result.data= data || "";
        result.count= count || 0;
        result.redirect=redirect;
    }
    else{
        result.state= true;
        result.message= message || "";
        result.data= data || "";
        result.count= count || 0;
    }
    return result;
};
/**
 * 加密
 * **/
utility.prototype.aesEncrypt = function(data,key) {
    key = key ==undefined?'password':key;
    var cipher = cryptp.createCipher('aes-256-cbc',key);
    return cipher.update(data,'utf8','hex') + cipher.final('hex');
};
/**
 * 解密
 * */
utility.prototype.aesDecrypt=function(data,key){
    try
    {
        key = key ==undefined?'password':key;
        var decipher = cryptp.createDecipher('aes-256-cbc',key);
        var dec=decipher.update(data,'hex','utf8')+decipher.final('utf8');
        return dec;
    }
    catch (e){
        return undefined;
    }
};

module.exports = new utility();



