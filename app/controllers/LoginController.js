angular.module('InventoryApp')
.controller('LoginController',
    ['$scope', '$http', '$q', '$location', 'AuthServices',
function ($scope, $http, $q, $location, AuthServices) {
    var vm = $scope;

    vm.isEmailError = false;
    vm.isPasswordError = false;

    vm.isLoggedIn = AuthServices.isLoggedIn();
    vm.isLoginError = false;
    vm.isAdmin = AuthServices.isAdmin();
    vm.isGeneral = AuthServices.isGeneral();
    vm.loginEmail = AuthServices.userName();
    vm.userName = AuthServices.userName();
    vm.loginPassword = AuthServices.password();
    vm.waiting = false;
    vm.submitted = false;


    if (AuthServices.isLoggedIn()) {
        $location.path('/');
    }

    //vm.processLogin = function (isValid, isEmail, isPassword) {
    //    AuthServices.processLogin(vm.loginEmail, vm.loginPassword);
    //    vm.waiting = true;
    //}

    vm.processLogin = function () {
        vm.isEmailError = false;
        vm.isPasswordError = false;

        if (vm.loginForm.$valid) {
            AuthServices.processLogin(vm.loginEmail, vm.loginPassword);
        } else {
            vm.isEmailError = vm.loginForm.loginEmail.$invalid;
            vm.isPasswordError = vm.loginForm.loginPassword.$invalid;
        }

        vm.waiting = true;
        vm.submitted = true;
    }

    vm.$on(AuthServices.eventLoginSuccess, function (event) {
        //alert('Logged in');
        vm.isLoggedIn = AuthServices.isLoggedIn();
        vm.isLoginError = false;
        vm.isAdmin = AuthServices.isAdmin();
        vm.isGeneral = AuthServices.isGeneral();
        vm.loginEmail = AuthServices.userName();

        $location.path('/');

        vm.waiting = false;
        vm.submitted = false;

    });


    vm.$on(AuthServices.eventLoginFail, function (event) {
        //alert('Log in failed');
        vm.isLoggedIn = AuthServices.isLoggedIn();
        vm.isLoginError = true;
        vm.isAdmin = AuthServices.isAdmin();
        vm.isGeneral = AuthServices.isGeneral();
        vm.loginEmail = AuthServices.userName();

        vm.submitted = false;
        vm.waiting = false;
    });


    vm.$on(AuthServices.eventLogoutSuccess, function (event) {
        //alert('Logout success');
        vm.isLoggedIn = AuthServices.isLoggedIn();
        vm.isLoginError = false;
        vm.isAdmin = AuthServices.isAdmin();
        vm.isGeneral = AuthServices.isGeneral();
        vm.loginEmail = AuthServices.userName();

        if (!AuthServices.isLoggedIn()) {
            $location.path('/login');
        }

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