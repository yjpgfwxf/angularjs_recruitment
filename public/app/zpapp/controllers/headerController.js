(function () {
    var headerController = function ($scope, $location,authService,systemInfoService) {
        var vm = this,appTitle = 'Recruitment Platform';
        vm.appTitle = appTitle;
        vm.isCollapsed = false;
        vm.navData=[];

        vm.highlight = function (path) {
            return $location.path().substr(0, path.length) === path;
        };

        vm.loginOrOut = function () {
            setLoginLogoutText();
            var isAuthenticated = authService.user.isAuthenticated;
            if (isAuthenticated) { //logout 
                authService.logout().then(function () {
                    $location.path('/');
                    return;
                });
            }
            redirectToLogin();
        };

        function redirectToLogin() {
            var path = '/login' + $location.$$path;
            $location.replace();
            $location.path(path);
        }

        $scope.$on('loginStatusChanged', function (loggedIn) {
            setLoginLogoutText(loggedIn);
            if(authService.systemInfo!=null) {
                var systemInfo = authService.systemInfo;
                vm.navData = systemInfo.modules;
            }
        });

        $scope.$on('redirectToLogin', function () {
            vm.navData=[];
            redirectToLogin();
        });

        function setLoginLogoutText() {
            vm.loginLogoutText = (authService.user.isAuthenticated) ? 'Logout' : 'Login';
        }

        function init(){
            setLoginLogoutText();

        }

        init();
    };

    angular.module('zpApp').controller('HeaderController', ['$scope', '$location','authService','systemInfoService',headerController]);

}());
