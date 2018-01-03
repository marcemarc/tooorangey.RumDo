angular.module("umbraco").controller("tooorangey.AddRedirectController", function ($scope, $http, dialogService, notificationsService, redirectUrlCheckService, navigationService, $location) {
    var vm = this;

    vm.status = {
        adding: false,
        readyToAdd: false
    };
    vm.data = {
        redirectToSelection: [],
        redirectFromUrl: ''
    }

    vm.addRedirect = addRedirect;
    vm.openContentPickerOverlay = openContentPickerOverlay;
    vm.remove = remove;

    function remove(index) {
        vm.data.redirectToSelection.splice(index, 1);
    };
       

    function addRedirect() {
        var urlStatus = redirectUrlCheckService.checkUrl(vm.data.redirectFromUrl);
        if (urlStatus.isValidUrl) {    
            // make http post request sending string redirectFromUrl, Guid contentKey
            var data = JSON.stringify({ redirectFromUrl: urlStatus.url, contentKey: vm.data.redirectToSelection[0].key });
            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            $http.post('/umbraco/backoffice/api/RumDoApi/CreateRedirect', data, config)
                .success(function (data, status, headers, config) {

                    notificationsService.remove(0);
                    notificationsService.success("Redirect '" + vm.data.redirectFromUrl + "' added", urlStatus.statusMessage);
                    init();
                     //reload the parent dashboard
                    $scope.$parent.vm.search();
                   
                })
                .error(function (data, status, header, config) {
                    notificationsService.remove(0);
                    notificationsService.error("Redirect '" + vm.data.redirectFromUrl + "' error", "something went wrong");
                });
        }
        else {    
                notificationsService.remove(0);
                notificationsService.error("Can't add the Redirect", urlStatus.statusMessage);
        }
    };

    function openContentPickerOverlay() {

        vm.contentPickerOverlay = {
            multiPicker: false,
            view: "contentpicker",
            show: true,
            submit: function (model) {
                console.log(model);
                vm.data.redirectToSelection = model.selection;
                vm.status.readyToAdd = vm.data.redirectFromUrl.length > 0 && vm.data.redirectToSelection.length > 0;
                vm.contentPickerOverlay.show = false;
                vm.contentPickerOverlay = null;
         
            },
            close: function (oldModel) {
                vm.contentPickerOverlay.show = false;            
                vm.contentPickerOverlay = null;
            }
        }

    };

    function init() {
        vm.data.redirectFromUrl = '';
        vm.data.redirectToSelection = [];
    }

    init();
});