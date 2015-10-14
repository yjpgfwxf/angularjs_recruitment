(function () {
    var systemInfoFactory = function ($http,$q, $rootScope) {
        var serviceUrl= {
            systemInfo: commonTools.systemInfoService + "systemInfo"
        };

        var factory={};

        //当前用户系统信息
        factory.systemInfo = null;

        /**
         * 根据用户token获取系统信息,同步执行
         * @param data
         * @returns {*}
         */
        factory.getSystemInfo=function(data) {
            var url = serviceUrl.systemInfo;
            var params = {Token: data};

            // 声明延后执行，表示要去监控后面的执行
            var deferred = $q.defer();
            var req = {
                method: 'GET',
                url: url,
                data: params
            };

            $http(req).
                success(function (data, status, headers, config) {
                    // 声明执行成功，即http请求数据成功，可以返回数据了
                    deferred.resolve(data);
                }).
                error(function (data, status, headers, config) {
                    // 声明执行失败，即服务器返回错误
                    deferred.reject(data);
                });
            // 返回承诺，这里并不是最终数据，而是访问最终数据的API
            return deferred.promise;
        }

        return factory;
    };
    angular.module('zpApp').factory('systemInfoService', ['$http','$q','$rootScope',systemInfoFactory]);
}());

