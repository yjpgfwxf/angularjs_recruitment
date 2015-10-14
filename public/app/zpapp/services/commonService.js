(function () {
    var commonFactory = function ($http, $rootScope) {
        var serviceBase = '/data/';
        var factory={};

        /**
         * 获取导航数据
         * @param data
         * @returns {*}
         */
        factory.getNavData=function(data){
            var params = data;
            var url = serviceBase + "modelData";
            return $http.get(url, {
                params: params
            }).then(function (results) {
                return results.data;
            });
        }


        return factory;
    };
    angular.module('zpApp').factory('commonService', ['$http', '$rootScope',commonFactory]);
}());

