(function () {

    var LoginController = function ($scope, $location, $routeParams, authService, systemInfoService) {
        var path = '/rightList';

        $scope.vm = {
            userName: null,
            userPwd: null,
            errorMessage: null,
            domain:'admin'
        };

        $scope.login = function () {
            authService.login($scope.vm).then(function (result) {
                if (!result.state) {
                    $scope.vm.errorMessage = result.message;
                    return;
                }

                if (status && $routeParams && $routeParams.redirect) {
                    path = path + $routeParams.redirect;
                }

                $location.path(path);
            });
        };
    };

    angular.module('zpApp').controller('LoginController', ['$scope', '$location', '$routeParams', 'authService', 'systemInfoService', LoginController]);

}());