var redis = require('redis');
var config = require('../../config/baseConfig');
var logger = require('../lib/logger.js');
var utility = require('./utility.js');
/**
 * @fileOverview (redis)缓存类
 * @author lml
 * @version 0.1
 */
/**
 * @author lml
 * @constructor redis
 * @description 提供操作redis方法
 * @since version 0.1
 */
function redisHelper() {
    var client = redis.createClient(config.redisSettings.port, config.redisSettings.host);
    client.on('error', function (err) {
        logger.error({message: 'redis connection error' + err, method:'redis'});
    });
    client.quit();
}
/**
 * @author lml
 * @description 生成key
 * @param str  例如：str 字符串
 * @return 根据配置文件编码的字符串
 * @since version 0.1
 */
redisHelper.prototype.createKey = function (str) {
    var str = config.basicSettings.environment + str;
    return utility.getEncode({str: str});
}
/**
 * @author lml
 * @description 通过key,value,expire设置值
 * @param key,value,expire 例如：key is key键，value is key值，expire is 过期时间单位秒
 * @since version 0.1
 */
redisHelper.prototype.set = function (key, value, expire) {
    var client = redis.createClient(config.redisSettings.port, config.redisSettings.host);
    client.on('error', function (err) {
        logger.error({message: 'redis connection error' + err, method:'redis'});
    });
    if (client.exists(key)) {
        client.del(key, function (err) {
            if (err) {
                logger.error({message: 'delete redis key error' + err, method:'redis'});
            }
        });
    } else {
        client.set(key, value);
        client.expire(key, expire || config.redisSettings.expires);
    }
    client.quit();
};
/**
 * @author lml
 * @description 通过key获取值
 * @param key,callback 例如：key is key键,callback 回调函数
 * @since version 0.1
 */
redisHelper.prototype.get = function (key, callback) {
    var client = redis.createClient(config.redisSettings.port, config.redisSettings.host);
    client.on('error', function (err) {
        logger.error({message: 'redis connection error' + err, method:'redis'});
    });
    client.get(key, function (err, value) {
            callback(err,value);
    });
    client.quit();
}
/**
 * @author lml
 * @description 通过key删除缓存中的值
 * @param key例如：key is key键
 * @since version 0.1
 */
redisHelper.prototype.del = function (key) {
    var client = redis.createClient(config.redisSettings.port, config.redisSettings.host);
    client.on('error', function (err) {
        logger.error({message: 'redis connection error' + err, method:'redis'});
    });
    client.del(key, function (err, reply) {
        if (err) {
            logger.error({message: 'delete redis key error' + err, method:'redis'});
        }
        if (reply > 0) {
            logger.info({message: 'delete redis key success' + err, method:'redis'});
        }
        client.quit();
    });
}

module.exports=new redisHelper();