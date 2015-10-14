/**
 * Created by wang on 2015/8/27.
 */
(function () {

    var app = angular.module('zpApp',
        ['ngRoute', 'ngAnimate', 'wc.directives', 'ui.bootstrap']);

    app.config(['$routeProvider', function ($routeProvider) {
        var viewBase = commonTools.viewBase+"zpapp/views/";
        $routeProvider
            //登录页面
            .when('/login', {
                controller: 'LoginController',
                templateUrl: viewBase + 'login.html'
            })
            //权限管理页面
            .when('/rightList',{
                controller:'RightListController',
                templateUrl:viewBase+'/rights/rightlist.html'
            })
            .otherwise({ redirectTo: '/login' });
    }]);

    app.run(['$rootScope', '$location', 'authService',
        function ($rootScope, $location, authService) {

            //Client-side security. Server-side framework MUST add it's
            //own security as well since client-based security is easily hacked
            $rootScope.$on("$routeChangeStart", function (event, next, current) {
                if (next && next.$$route && next.$$route.secure) {
                    if (!authService.user.isAuthenticated) {
                        $rootScope.$evalAsync(function () {
                            authService.redirectToLogin();
                        });
                    }
                }
            });
        }]);

}());

