angular.module("umbraco").controller("tooorangey.ManageRedirectsActionMenuController", function ($scope, $http, dialogService, notificationsService, navigationService, $location, redirectUrlsResource, redirectUrlCheckService, localizationService) {
    var vm = this;

    vm.status = {
        loading: false,
        loaded: false,
        hasRedirects: false,
        currentContentItem: null
    };
    vm.data = {
        redirects: [],
        redirectFromUrl: ''
    }

    vm.addRedirect = addRedirect;
    vm.removeRedirect = removeRedirect;

    function removeRedirect(redirectToDelete) {

        localizationService.localize("redirectUrls_confirmRemove", [redirectToDelete.Url, vm.status.currentContentItem.name]).then(function (value) {
            var toggleConfirm = confirm(value);

            if (toggleConfirm) {
                redirectUrlsResource.deleteRedirectUrl(redirectToDelete.Key).then(function () {

                    var index = vm.data.redirects.indexOf(redirectToDelete);
                    vm.data.redirects.splice(index, 1);
                    notificationsService.success(localizationService.localize("redirectUrls_redirectRemoved"));                 
                    init();
                    navigationService.hideDialog();
                }, function (error) {
                    notificationsService.error(localizationService.localize("redirectUrls_redirectRemoveError"));
                    init();
                    navigationService.hideDialog();
                });
            }
        });

    } 

    function addRedirect() {

        var urlStatus = redirectUrlCheckService.checkUrl(vm.data.redirectFromUrl);
        console.log(urlStatus);
        if (urlStatus.isValidUrl) {    
            // make http post request sending string redirectFromUrl, Guid contentKey
            var data = JSON.stringify({ redirectFromUrl: urlStatus.url, contentUdi: vm.status.currentContentItem.udi});
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
                    navigationService.hideDialog();
                   
                   
                })
                .error(function (data, status, header, config) {
                    console.log(data);
                    notificationsService.remove(0);
                    notificationsService.error("Redirect '" + vm.data.redirectFromUrl + "' error", "something went wrong");
                    navigationService.hideDialog();
                });
        }
        else {    
                notificationsService.remove(0);
                notificationsService.error("Can't add the Redirect", urlStatus.statusMessage);
                navigationService.hideDialog();
        }
    };

    function getRedirects() {
        vm.status.loading = true;
        var dialogOptions = $scope.dialogOptions;
        vm.status.currentContentItem = dialogOptions.currentNode;
        // udi
        var parameters = {
            contentUdi: vm.status.currentContentItem.udi
        };
        var config = {
            params: parameters
        };

        $http.get('/umbraco/backoffice/api/RumDoApi/GetContentRedirectUrls', config)
            .success(function (data, status, headers, config) {
                vm.data.redirects = data;
                vm.status.hasRedirects = vm.data.redirects.length > 0;
                vm.status.loading = false;
                vm.status.loaded = true;
            })
            .error(function (data, status, header, config) {
                console.log(data);
                notificationsService.remove(0);
                notificationsService.error("Error retrieving redirects", "something went wrong");
            });
    }

    function init() {

        // go off and get all redirects for this node
        // if there aren't any explain their aren't any
        // list out all found redirects that target this node
        // present form to add a new redirect
        getRedirects();
        vm.data.redirectFromUrl = '';

    }

    init();
});