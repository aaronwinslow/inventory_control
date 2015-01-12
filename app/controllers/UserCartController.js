angular.module('InventoryApp')
.controller('UserCartController',
   ['$scope', '$q', '$location', '$routeParams', 'ItemServices', 'CartServices', 'OrderService', 'AuthServices', 'UserServices',     //add services names in single quotes
function ($scope, $q, $location, $routeParams, ItemServices, CartServices, OrderService, AuthServices, UserServices) {    //add service names as params

    var vm = $scope;

    //set default column order
    vm.predicate = 'itemName';
    vm.reverse = false;

    AuthServices.AuthInit(AuthServices.roleGeneral);

    vm.cartItems = CartServices.getCartItems();
    vm.isSubmitted = false;
    vm.departmentId = AuthServices.departmentId();
    vm.departments = [];

    UserServices.getDepartments();

    vm.$on(UserServices.eventDepartmentsReceived, function () {
        vm.departmentId = AuthServices.departmentId();
        vm.departments = UserServices.Departments();
    })

    vm.cancelCart = function () {
        CartServices.clearCart();
        $location.path('/userorder');
    }

    vm.removeItem = function (order) {
        var index = vm.cartItems.map(function (e) { return e.itemId; }).indexOf(order.itemId);
        vm.cartItems.splice(index, 1);
        vm.cartItems = CartServices.getCartIems();
    }

    vm.submitCart = function () {
        for (var i = 0; i < vm.cartItems.length; i++) {
            var order = OrderService.NewOrder();
            order.userId = vm.cartItems[i].userId;
            order.departmentId = vm.departmentId;
            order.itemId = vm.cartItems[i].itemId;
            order.itemName = vm.cartItems[i].itemName;
            order.orderQuantity = vm.cartItems[i].amountNeeded;

            OrderService.createOrder(order);
        }

        //order has been submitted, need to clear cart and show "submitted" message
        CartServices.clearCart();
        vm.isSubmitted = true;
    }

    vm.cartIsEmpty = function () {
        return vm.cartItems.length == 0;
    }

    vm.goHome = function () {
        $location.path('/userhome');
    }

    /*----------------------------------------------------
     vm.checkQuantityRangeObj

     Description
         check range of a number on an object

     Params
         item - object containing number
         field - string name of property for number
         min - min value
         max - max value
         defaultNaN - default value if number is not a number
         allowEmpty - allow the empty string for the value

     Example: place this as attribute on input element

        ng-change="checkQuantityRangeObj(iteml, 'quantityOnPallet', 1, item.quantityPerPallet, item.quantityPerPallet, true)"

     */
    vm.checkQuantityRangeObj = function (item, field, min, max, defaultNaN, allowEmpty) {
        var quantity = item[field];
        var quantityNum = quantity / 1;

        if (quantity == '' && allowEmpty) {
            item[field] = '';
        }
        else if (isNaN(quantityNum)) {
            item[field] = defaultNaN;
        }
        else if (quantityNum < min) {
            item[field] = min;
        }
        else if (quantityNum > max) {
            item[field] = max;
        }
    }

}]);