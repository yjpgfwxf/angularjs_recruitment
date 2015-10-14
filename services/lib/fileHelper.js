var extend = require("extend");
var formidable = require('formidable');
var path=require('path');
var fs = require('fs');
/**
 * @fileOverview 文件操作类
 * @author lml
 * @version 0.1
 */
/**
 * @author lml
 * @constructor file
 * @description 创建file对象
 * @since version 0.1
 */
var file=function(){}
/**
 * @description 上传文件到服务器
 * @param {object}
 * @since version 0.1
 */
file.prototype.uploadFileToServer=function(params){
var setting={encoding:'utf-8',keepExtensions:true,maxFieldsSize:2*1024*1024,multiples:false,uploadDir:'/upload/logo',cb:function(err,path){
    if(err){
        setting.cb(err);
    }
}};
    setting=extend({},setting,params);
    var form = new formidable.IncomingForm();
    form.encoding=setting.encoding;
    form.keepExtensions=setting.keepExtensions;
    form.maxFieldsSize=setting.maxFieldsSize;
    form.uploadDir=setting.uploadDir;
    form.parse(setting.req, function (err, fields, files){
      if(err){
          setting.cb(err);
      }else{
        setting.cb(null,files);
      }
    });
    form.on('error', function(err) {
        setting.cb(err);
    });

}
/**
 * @description 下载文件从服务器
 * @param {object}
 * @since version 0.1
 */
file.prototype.downloadFileFromServer=function(params){
 var setting={encoding:'utf-8',reName:'',uploadDir:''}
    setting=extend({},setting,params);
 var filePath=setting.uploadDir;
    fs.exists(filePath, function (exists) {
        if(exists){
            if(setting.reName!=undefined&&setting.reName!=''){
                setting.res.download(filePath,setting.reName,function(err,result){
                    if(err)
                    setting.cb(err);
                });
            }else{
                setting.res.sendFile(filePath);
            }

        }else{
          setting.res.statusCode=404;
          setting.res.statusMessage='Not found';
          setting.res.end();
        }
    });
}
/**
 * @description 删除文件从服务器
 * @param {object}
 * @since version 0.1
 */
file.prototype.deleteFileFromServer=function(params){
    var setting={encoding:'utf-8',filePath:''}
    setting=extend({},setting,params);
    var filePath=setting.filePath;
    fs.exists(filePath, function (exists) {
        if(exists){
            fs.unlink(filePath,function(err,res){
                setting.cb(err,res);
            });
        }else{
            setting.cb(null,true);
        }
    });
}
module.exports=new file();
