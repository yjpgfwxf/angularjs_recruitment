/**
 * Created by Guoliang Cui on 2015/5/5.
 */
var utility=require('../lib/utility');
var ConfigInfo=require("../../config/baseConfig")
exports.getVersion=function(req,res){
    var params=utility.parseParams(req).query;
    var resultObj;
    resultObj=utility.jsonResult(false,"OK",{version:ConfigInfo.basicSettings[params.key]});
    res.send(resultObj);
}