var path=require('path');
var config = function () {
};

config.prototype.businessDB = {
    connectionLimit: 10,
    host: '10.9.100.42',
    user: 'root',
    password: 'Pass@word1',
    database: 'digital_marketing_business_sit',//'digital_marketing_sit',
    multipleStatements: true
};
config.prototype.localDB = {
    connectionLimit: 10,
    host: '127.0.0.1',
    user: 'root',
    password: 'mysql',
    database: 'digital_marketing_business',//'digital_marketing_sit',
    multipleStatements: true
};
config.prototype.tokenConfig = {
    skipVerification: [
        'js',
        'img',
        'css',
        'favicon.ico',
        'login',
        'services',
        'citycard'
    ],
    tokenSaveDays: 7,//用于配置在mySqlDB/Redis中token的过期时间，单位：天
    defaultRedirectPage: "/index.html"//
};

config.prototype.expressStaticOption = {
    path:'../../public/',//var/www/platform_sit
    autoPath:'../../auto/',
    login:'login.html',
    index:'home.html',
    error:'error.html',
    session:'session.html',
    autoRegister:'register.html',
    autoLogin:'home.html',
    autoHome:'platform.html'
}

config.prototype.redisSettings = {
    host: "127.0.0.1",
    port: 6379,
    dataExpires: 60 * 60, //用于配置在Redis存储的数据过期时间，单位：秒
    expires: 60 * 60 * 24 * 7//用于配置在Redis存储的数据默认过期时间，单位：秒
};

config.prototype.basicSettings = {
    algorithm: "sha512",//加密算法
    logger: 0,//日志输出位置，1:本机，0：数据库
    cookieAge: 1000*60*60*4,
    sitePort: 10005,
    dbconfig: {masterConfig: "masterConfig", logConfig: "logConfig"},
    cluster: config.prototype.Cluster,
    currentDb: config.prototype.businessDB,
    cookieSecret: "iMarketing",
    environment: "sentiment_sit", //"PROD" "SIT"，
    innerVersion: "v2.0.2-20150824-6993-02",//舆情系统版本号
    autoVersion: "v1.0.2-20150825-7315-03",//舆情自助系统版本号
    linuxShellUrl: "/var/www/quickDeploy",
    uploadFile: "./public/reportFiles",
    uploadFileSize: 2//2M
};

config.prototype.dataServiceSettings = {
    algorithm: "sha512",//加密算法
    logger: 0,//日志输出位置，1:本机，0：数据库
    cookieAge: 5 * 60 * 1000,
    sitePort: 10003,
    dbconfig: {masterConfig: "masterConfig", logConfig: "logConfig"},
    cluster: config.prototype.Cluster,
    currentDb: config.prototype.businessDB,
    cookieSecret: "iMarketing",
    environment: "sentiment_sit", //"PROD" "SIT",
    linuxShellUrl: "/var/www/quickDeploy",
    uploadFile: "./public/reportFiles",
    uploadFileSize: 2, //2M
    apiName:{
        getToken:"getToken",
        djson:"d.json",
        hotWords:"hotWords",
        getQueryData:"getQueryData"
    }
};
config.prototype.logServiceSettings={
    appenders: [
        {
            type:'console',
            layout: {
                type: 'pattern',
                pattern: "[%r] [%c] - %m%n"
            }
        },
        {
            type: "file",
            filename:path.resolve(__dirname,"../logs/infor/infor.log"),
            pattern: "-yyyy-MM-dd",
            alwaysIncludePattern: false,
            layout: {
                type: 'pattern',
                pattern: "[%r] [%c] - %m%n"
            },
            category:"infor"
        },
        {
            type: "file",
            filename:path.resolve(__dirname,"../logs/error/error.log"),
            pattern: "-yyyy-MM-dd",
            alwaysIncludePattern: false,
            layout: {
                type: 'pattern',
                pattern: "[%r] [%[%5.5p%]] - %m%n"
            },
            category:"error"
        }
    ],
    replaceConsole: true

};
config.prototype.fileServiceSettings = {
    sitePort: 10004,
    uploadLogo:path.resolve(__dirname,"../uploadFile/logo"),
    uploadLogoReport:path.resolve(__dirname,"../uploadFile/report"),
    downloadExcel:path.resolve(__dirname,"../uploadFile/temp"),
    uploadFileSize: 2//2M
};
config.prototype.proxy = {
    crawTool: {prefix: '/crawl-template-webtool/*', url: 'http://192.168.100.236:8383', domain: ''},
    crawEngine: {prefix: '/crawEngine/*',prefixHead:'crawEngine',host:'192.168.100.32',port:'8080', url: 'http://192.168.100.32:8080/', domain: ''},
    segmentWorld: {prefix: '/services/*',host:'192.168.100.183',port:'8899', url: 'http://192.168.100.183:8899', domain: ''}//sit
}

config.prototype.baseInfoSeting={
    //系统url
    systemUrl:'http://223.223.181.117:10048/',
    //文件库
    fileLib:{
        //网站地址
        host:'http://10.10.203.183:10004',
        uploadLogo:{
            //logo上传地址
            uploadUrl:'/uploadLogo',
            //logo删除地址
            delUrl:'/dimage/',
            //图片下载地址
            imageUrl:'http://223.223.181.117:10046/image/'
        }
    },
    api:{
        //api服务地址
        url:'http://223.223.181.117:10047/services/'
    }
};

module.exports = new config();



