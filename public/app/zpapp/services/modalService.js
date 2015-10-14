(function () {

    var modalService = function ($modal) {
        var templateUrl=commonTools.viewBase+"zpapp/partials/modal.html";
        var modalDefaults = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
            templateUrl: templateUrl
        };

        var modalOptions = {
            closeButtonText: 'Close',
            actionButtonText: 'OK',
            headerText: 'Proceed?',
            bodyText: 'Perform this action?'
        };

        this.showModal = function (customModalDefaults, customModalOptions) {
            if (!customModalDefaults) customModalDefaults = {};
            customModalDefaults.backdrop = 'static';
            return this.show(customModalDefaults, customModalOptions);
        };

        this.show = function (customModalDefaults, customModalOptions) {
            //Create temp objects to work with since we're in a singleton service
            var tempModalDefaults = {};
            var tempModalOptions = {};

            //Map angular-ui modal custom defaults to modal defaults defined in this service
            angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

            //Map modal.html $scope custom properties to defaults defined in this service
            angular.extend(tempModalOptions, modalOptions, customModalOptions);

            if (!tempModalDefaults.controller) {
                tempModalDefaults.controller = function ($scope, $modalInstance) {
                    $scope.modalOptions = tempModalOptions;
                    $scope.modalOptions.ok = function (data) {
                        $modalInstance.close({type:'ok',data:tempModalOptions.user});
                    };
                    $scope.modalOptions.close = function (result) {
                        $modalInstance.close({type:'cancel'});
                    };
                };

                tempModalDefaults.controller.$inject = ['$scope', '$modalInstance'];
            }

            return $modal.open(tempModalDefaults).result;
        };
    };

    angular.module('zpApp').service('modalService', ['$modal',modalService]);

}());