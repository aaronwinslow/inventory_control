angular.module('InventoryApp')
.controller('UserHomeController',
    ['$scope', '$q', '$location', '$routeParams', 'OrderService', 'AuthServices',      //add services names in single quotes
function ($scope, $q, $location, $routeParams, OrderService, AuthServices) {     //add service names as params

    var vm = $scope;

    //set default column order
    vm.predicate = 'orderId';
    vm.reverse = false;

    AuthServices.AuthInit(AuthServices.roleGeneral);

    vm.orders = [];
    vm.userId = AuthServices.userId();

    OrderService.getOrderByUserId(vm.userId);

    vm.$on(OrderService.eventOrderReceived, function () {
        vm.orders = OrderService.Orders();
    })

    vm.deleteOrder = function (order) {
        order.userDeleted = true;
        OrderService.updateOrder(order);
    }


}]);