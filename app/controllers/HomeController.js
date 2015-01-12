
angular.module('InventoryApp')
.controller('HomeController',
    ['$scope', '$q', '$location', '$routeParams', 'AuthServices',       //add services names in single quotes
function ($scope, $q, $location, $routeParams, AuthServices) {    //add service names as params

    var vm = $scope;

    if (AuthServices.isLoggedIn()) {
        if (AuthServices.isAdmin()) {
            $location.path('/ordersa');
        } else if (AuthServices.isGeneral()) {
            $location.path('/userhome');
        } else if (AuthServices.isPasswordReset()) {
            $location.path('/password');
        } else {
            $location.path('/');
        }
    } else {
        $location.path('/login');
    }


}]);