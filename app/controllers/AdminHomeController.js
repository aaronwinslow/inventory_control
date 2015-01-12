angular.module('InventoryApp')
.controller('AdminHomeController',
    ['$scope', '$q', '$location', '$routeParams', 'AuthServices',       //add services names in single quotes
function ($scope, $q, $location, $routeParams, AuthServices) {    //add service names as params

    var vm = $scope;

    AuthServices.AuthInit(AuthServices.roleAdmin);

}]);