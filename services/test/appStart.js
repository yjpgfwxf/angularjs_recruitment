var unit=require('./unitapi.js');
var mysqlHelper = require('../lib/mysqlHelper.js');
var httpHelper =require('../lib/httpHelper.js');
//var mysql=new mysqlHelper(config.basicSettings.currentDb);
//unit.getLogList({noCache:1});
//unit.getLogList({noCache:0});
//unit.updateLog({message:'eee',method:this.name});
//unit.login({body:{params:{systemAlias:'isentiment',userName:'admin',userPwd:'ba3253876aed6bc22d4a6ff53d8406c6ad864195ed144ab5c87621b6c233b548baeae6956df346ec8c17f5ea10f35ee3cbc514797ed7ddd3145464e2a0bab413'}}},{send:function(params){
//    console.log(params);
//}});
//unit.getBusinessSystemDb(['testsystem15'],function(err,result){
//    if(err){
//        console.log(err);
//    }else{
//        console.log(result[0]);
//        var dbStr=JSON.parse(result[0].db_str);
//        var mysql=new mysqlHelper(dbStr);
//        mysql.executeQueryNoCache({sql:'select *from core_log',cb:function(err,result){
//            if(err){
//                console.log(err);
//            }else{
//                console.log(result);
//            }
//        }});
//    }
//});
//httpHelper.request({cb:function(data){
    //console.log(data.toString());
//}});


var apiConfig={
    token:['0b840d75-ff7d-11e4-802a-02163e1e2af0'],
    apitoken:{},
    getParamsQueryData:function(){
        return {
            accessToken:apiConfig.apitoken[apiConfig.token[0]].accessToken,
            keywords:'',
            startPublishDate:'2015-04-19 18:00:00',
            endPublishDate:'2015-05-22 18:00:00',
            pageNo:1,
            pageSize:20
        }
    }
};

//获取token
function testGetToken(token){
    var data={};
    unit.getToken(token,function(result){
        console.log("getToken"+ JSON.stringify(result));
        apiConfig.apitoken[token] ={accessToken: result.data.accessToken,count:0};
    });
}

//获取数据
function testGetQueryData(data,ip){

    unit.getQueryData(data,ip, function(result){
        console.log("GetQueryData"+ JSON.stringify(result));
    });
}

//测试获取token后获取数据
function testGetTokenGetData(){

    setTimeout(function(){
        var params=apiConfig.getParamsQueryData();
        params.accessToken=apiConfig.apitoken[apiConfig.token[0]].accessToken;
        //params.pageSize='abc';
        //params.pageNo='abc';
        testGetQueryData(params,"127.0.0.1");
    },500);
};

//测试传不同的参数
function testGetQueryDataParams(){
    setTimeout(function(){
        var params=apiConfig.getParamsQueryData();
        params.accessToken=apiConfig.apitoken[apiConfig.token[0]].accessToken;

        testGetQueryData(params,"127.0.0.1");

        var params1=apiConfig.getParamsQueryData();
        //结束时间为空
        params1.endPublishDate="";
        testGetQueryData(params1,"127.0.0.1");

        var params2=apiConfig.getParamsQueryData();
        params2.pageNo=2;
        testGetQueryData(params2,"127.0.0.1");

        var params3=apiConfig.getParamsQueryData();
        params3.pageSize=100;
        testGetQueryData(params3,"127.0.0.1");

        var params4=apiConfig.getParamsQueryData();
        params4.pageNo=1000;
        testGetQueryData(params4,"127.0.0.1");

        var params5=apiConfig.getParamsQueryData();
        params5.keywords="aa";
        params5.pageNo=1;
        params5.pageSize=20;
        testGetQueryData(params5,"127.0.0.1");


        params.startPublishDate="2222";
        params.endPublishDate="dfa";
        testGetQueryData(params,"127.0.0.1");

        params.accessToken="";
        testGetQueryData(params,"127.0.0.1");

        params.accessToken="ddfdasfa";
        testGetQueryData(params,"127.0.0.1");
    },500);
}

function testGetQueryCount(){
    setTimeout(function(){
        var count=600;
        for(var i=0;i<count;i++){
            var params=apiConfig.getParamsQueryData();
            params.accessToken=apiConfig.apitoken[apiConfig.token[0]].accessToken;
            testGetQueryData(params,"127.0.0.1");
        }
    },500);
}

function testTokenExpires(){
    setTimeout(function(){

            var params=apiConfig.getParamsQueryData();
            params.accessToken=apiConfig.apitoken[apiConfig.token[0]].accessToken;
            testGetQueryData(params,"127.0.0.1");

    },6001*11);
}

function init(){
    //获取token
    testGetToken(apiConfig.token[0]);

    //测试获取token后获取数据
    testGetTokenGetData();
    return;
    //测试不同的参数
    //testGetQueryDataParams();

    //测试访问500次
    testGetQueryCount();

    //测试token 过期
    //testTokenExpires()
}

init();


