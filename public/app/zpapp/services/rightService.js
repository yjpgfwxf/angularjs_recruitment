(function () {
    var rightFactory = function ($http, $rootScope) {

        var baseUrl=commonTools.rightService;

        /**
         * 服务url地址
         * @type {{group: {get: string, add: string, update: string, delete: string}, user: {get: string, add: string, update: string, delete: string}}}
         */
        var serviceUrl= {
            org: {
                getList: baseUrl + "groupInfo",
                get: "",
                add: "",
                update: baseUrl + "editGroup",
                delete: baseUrl + "deleteGroup"
            },
            user: {
                getList: baseUrl + "queryUser",
                get: "",
                add: baseUrl + "addUser",
                update: "",
                delete: baseUrl + "deleteUser"
            }
        }
        var factory={
            org:{},
            user:{}
        };

        /**
         * 获取用户列表数据
         * @param params
         * @returns {*}
         */
        factory.user.getList=function(params){
            var url = serviceUrl.user.getList;
            return $http.get(url, {
                params: params
            }).then(function (results) {
                return results.data;
            });
        };
        /**
         * 获取用户数据
         * @param params
         * @returns {*}
         */
        factory.user.get=function(params){
            var url = serviceUrl.user.get;
            return $http.get(url, {
                params: params
            }).then(function (results) {
                return results.data;
            });
        }
        /**
         * 添加
         * @param data
         * @returns {*}
         */
        factory.user.add=function(data) {
            var url = serviceUrl.user.add;
            return $http.post(url, data).then(
                function (results) {
                    return results.data;
                });
        }

        /**
         * 修改
         * @param data
         * @returns {*}
         */
        factory.user.update = function(data){
            var url = serviceUrl.user.update;
            return $http.post(url, data).then(
                function (results) {
                    return results.data;
                });
        }

        /**
         * 删除
         * @param data
         * @returns {*}
         */
        factory.user.delete = function(data){
            var url = serviceUrl.user.delete;
            return $http.post(url, data).then(
                function (results) {
                    return results.data;
                });
        }


        /**
         * 获取左侧导航树的数据
         * @param params
         * @returns {*}
         */
        factory.org.getList=function(params){
            var url = serviceUrl.org.getList;
            return $http.get(url, {
                params: params
            }).then(function (results) {
                return results.data;
            });
        }

        /**
         * 获取左侧导航树的数据
         * @param params
         * @returns {*}
         */
        factory.org.get=function(params){
            var url = serviceUrl.org.get;
            return $http.get(url, {
                params: params
            }).then(function (results) {
                return results.data;
            });
        }

        /**
         * 添加
         * @param data
         * @returns {*}
         */
        factory.org.add=function(data) {
            var url = serviceUrl.org.add;
            return $http.post(url, data).then(
                function (results) {
                    return results.data;
                });
        }

        /**
         * 修改
         * @param data
         * @returns {*}
         */
        factory.org.update = function(data){
            var url = serviceUrl.org.update;
            return $http.post(url, data).then(
                function (results) {
                    return results.data;
                });
        }

        /**
         * 删除
         * @param data
         * @returns {*}
         */
        factory.org.delete = function(data){
            var url = serviceUrl.org.delete;
            return $http.post(url, data).then(
                function (results) {
                    return results.data;
                });
        }

        return factory;
    };
    angular.module('zpApp').factory('rightService', ['$http', '$rootScope',rightFactory]);
}());

