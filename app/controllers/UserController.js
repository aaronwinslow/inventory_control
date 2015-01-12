angular.module('InventoryApp')
.controller('UserController',
    ['$scope', '$q', '$location', '$routeParams', 'UserServices', 'AuthServices',      //add services names in single quotes
function ($scope, $q, $location, $routeParams, UserServices, AuthServices) {    //add service names as params

    var vm = $scope;

    AuthServices.AuthInit(AuthServices.roleAdmin);

    vm.user = {};
    vm.departments = [];

    vm.userId = $routeParams.id;

    vm.loggedInUserId = AuthServices.userId();

    if (vm.userId == 0)  //if a new user
    {
        vm.user = UserServices.NewUser();
        UserServices.getDepartments();
    }
    else if (!vm.userId)  //if user changing password
    {
        vm.user = UserServices.getUser(AuthServices.userId());
    }
    else {
        UserServices.getUser(vm.userId);
    }

    vm.$on(UserServices.eventUserReceived, function () {
        vm.user = UserServices.User();
        vm.departments = UserServices.Departments();
    })


    vm.$on(UserServices.eventUserUpdated, function () {
        vm.user = UserServices.User();
        $location.path('/users');
    })

    vm.$on(UserServices.eventUserSaveError, function () {
        vm.user = UserServices.User();

        //possible errors from server
        //"isUserSaveError": false,
        //"userName_Err": null,
        //"isExistingUserNameErr": false,
        //"firstName_Err": null,
        //"lastName_Err": null,
        //"departmentId_Err": null,
        //"email_Err": null,
        //"isExistingEmail": false

    })

    vm.$on(UserServices.eventDepartmentsReceived, function () {
        if (vm.user) {
            vm.user.departmentId = 0;
            vm.departments = UserServices.Departments();
        }

    })

    vm.saveUser = function () {
        UserServices.postUser(vm.user);
    }

    vm.cancelUpdateUser = function () {
        $location.path('/users');
    }

    vm.resetPassword = function () {
        vm.user.isSetPassword = true;
        UserServices.postUser(vm.user);
        return false;
    }

    vm.updatePassword = function () {
        vm.user.isUserChangePassword = true;
        vm.user.newPassword = vm.newPassword;
        UserServices.postUserPassword(vm.user);
        AuthServices.processLogout();
        $location.path('/');
    }

    vm.getUserTypes = function () {
        AuthServices.getUsersTypes();
    }
}]);