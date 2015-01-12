angular.module('InventoryApp')
.controller('NavController',
    ['$scope', '$http', '$q', '$route', '$location', 'AuthServices',
function ($scope, $http, $q, $route, $location, AuthServices) {

    var vm = $scope;
   
    $scope.$route = $route;

    AuthServices.AuthInit('');

    vm.isLoggedIn = AuthServices.isLoggedIn();
    vm.isLoginError = false;
    vm.isAdmin = AuthServices.isAdmin();
    vm.isGeneral = AuthServices.isGeneral();
    vm.loginEmail = AuthServices.userName();

    vm.getUrl == function () {
        vm.url = $location.url();
    }

    vm.processLogin = function () {
        AuthServices.processLogin(vm.loginEmail, vm.loginPassword);
    }

    vm.processLogout = function () {
        AuthServices.processLogout();
        vm.isLoginError = false;
    }

    vm.$on(AuthServices.eventLoginSuccess, function (event) {
        //alert('Logged in');
        vm.isLoggedIn = AuthServices.isLoggedIn();
        vm.isLoginError = false;
        vm.isAdmin = AuthServices.isAdmin();
        vm.isGeneral = AuthServices.isGeneral();
        vm.loginEmail = AuthServices.userName();
    });


    vm.$on(AuthServices.eventLoginFail, function (event) {
        //alert('Log in failed');
        vm.isLoggedIn = AuthServices.isLoggedIn();
        vm.isLoginError = false;
        vm.isAdmin = AuthServices.isAdmin();
        vm.isGeneral = AuthServices.isGeneral();
        vm.loginEmail = AuthServices.userName();
    });


    vm.$on(AuthServices.eventLogoutSuccess, function (event) {
        //alert('Logout success');
        vm.isLoggedIn = AuthServices.isLoggedIn();
        vm.isLoginError = false;
        vm.isAdmin = AuthServices.isAdmin();
        vm.isGeneral = AuthServices.isGeneral();
        vm.loginEmail = AuthServices.userName();
    });


    vm.$on(AuthServices.eventLogoutFail, function (event) {
        //alert('Log out failed');
        vm.isLoggedIn = AuthServices.isLoggedIn();
        vm.isLoginError = false;
        vm.isAdmin = AuthServices.isAdmin();
        vm.isGeneral = AuthServices.isGeneral();
        vm.loginEmail = AuthServices.userName();
    });

}]);