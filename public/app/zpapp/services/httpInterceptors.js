(function () {


    angular.module('zpApp').factory('httpInterceptors', ['$location',function($location) {
        var httpInterceptors = {
            request: function(config) {

                return config;
            },
            response: function(response) {

                return response;
            }
        };
        return httpInterceptors;
    }]);
    angular.module('zpApp').config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push('httpInterceptors');
    }]);


}());


