var http = require('http');
var extend = require("extend");
exports.request = function (params) {
    var options = {
        hostname: '',
        path:'',
        method:'GET',
        headers:{

        }
    };
    options = extend({}, options, params);
    var req = http.request(options, function (res) {
        //console.log(res);
        var chunks=[];
        var size=0;
        res.on('data', function (chunk) {
            chunks.push(chunk);
            size+=chunk.length;
        });
       res.on('end',function(res){
           var data = null;
           switch(chunks.length) {
               case 0: data = new Buffer(0);
                   break;
               case 1: data = chunks[0];
                   break;
               default:
                   data = new Buffer(size);
                   for (var i = 0, pos = 0, l = chunks.length; i < l; i++) {
                       var chunk = chunks[i];
                       chunk.copy(data, pos);
                       pos += chunk.length;
                   }
                   break;
           }
           if(params.cb){
               params.cb(data);
           }
       });
    });
    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });
    if(options.method=='post'){
        req.write(options.postData);
    }
    req.end();
}

exports.requestApi = function (params,pdata) {
    var options = {
        hostname: '',
        path:'',
        method:'GET',
        headers:{

        }
    };
    options = extend({}, options, params);
    var req = http.request(options, function (res) {
        //console.log(res);
        var chunks=[];
        var size=0;
        res.on('data', function (chunk) {
            chunks.push(chunk);
            size+=chunk.length;
        });
        res.on('end',function(res){
            var data = null;
            switch(chunks.length) {
                case 0: data = new Buffer(0);
                    break;
                case 1: data = chunks[0];
                    break;
                default:
                    data = new Buffer(size);
                    for (var i = 0, pos = 0, l = chunks.length; i < l; i++) {
                        var chunk = chunks[i];
                        chunk.copy(data, pos);
                        pos += chunk.length;
                    }
                    break;
            }
            if(params.cb){
                params.cb(data,pdata);
            }
        });
    });
    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });
    if(options.method=='post'){
        req.write(options.postData);
    }
    req.end();
}
