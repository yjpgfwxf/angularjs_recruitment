(function () {
    var authFactory = function ($q, $http, $rootScope, $location) {

        var serviceBase = '/authenticate/';
        var factory = {
            loginPath: '/login',
            user: {
                isAuthenticated: false,
                roles: null
            }
        };

        //登录
        factory.login = function (user) {
            var url = commonTools.domain + serviceBase + 'login';
            var data = {
                domain: user.domain,
                userName: user.userName,
                userPwd: user.userPwd
            };
            return $http.post(url, data).then(
                function (results) {
                    var loggedIn = results.data.state;
                    //如果登录成功，设置用户系统信息
                    if (loggedIn) {
                        var systemInfoData = results.data.data.systemInfo;
                        factory.systemInfo = systemInfoData;
                    }
                    changeAuth(loggedIn);
                    return results.data;
                });
        };

        //当前用户系统信息
        factory.systemInfo = null;

        factory.logout = function () {
            var url = commonTools.domain + serviceBase + 'logout';
            return $http.post(url).then(
                function (results) {
                    var loggedIn = !results.data.status;
                    changeAuth(loggedIn);
                    return loggedIn;
                });
        };

        //检查权限
        factory.permissionCheck = function (options) {
            // 声明延后执行，表示要去监控后面的执行
            var deferred = $q.defer();
            // 检查是否已从服务获取到权限对象(已登录用户的角色列表)
            if (factory.user.isAuthenticated) {
                getPermission();
                deferred.resolve(true);
            }
            else {
                var url = commonTools.systemInfoService + "systemInfo";
                // 声明延后执行，表示要去监控后面的执行
                var req = {
                    method: 'GET',
                    url: url
                };

                $http(req).
                    success(function (data, status, headers, config) {
                        factory.systemInfo= data.data;
                        changeAuth(true)
                        deferred.resolve(data);  // 声明执行成功，即http请求数据成功，可以返回数据了
                    }).
                    error(function (data, status, headers, config) {
                        changeAuth(false)
                        deferred.reject(false);   // 声明执行失败，即服务器返回错误
                    });

            }
            return deferred.promise;
        }

        factory.redirectToLogin = function () {
            $rootScope.$broadcast('redirectToLogin', null);
        };

        function changeAuth(loggedIn) {
            factory.user.isAuthenticated = loggedIn;
            $rootScope.$broadcast('loginStatusChanged', loggedIn);
        }

        function getPermission() {

        }

        return factory;
    };
    angular.module('zpApp').factory('authService', ['$q', '$http', '$rootScope', '$location', authFactory]);
}());

