angular.module('InventoryApp').factory('CartServices', [
    '$http', '$q', '$rootScope', 'AuthServices',
function ($http, $q, $rootScope, AuthServices) {

    cartItems = [];
    var errors = [];

    var getCartItems = function () {
        return cartItems;
    }

    var clearCart = function () {
        cartItems.length = 0;
    }

    var addCartItem = function (item) {

        var itemFound = false;

        item.userId = AuthServices.userId();
        item.departmentId = AuthServices.departmentId();

        //convert amountNeeded to number from string
        item.amountNeeded = item.amountNeeded / 1;

        //if item is already in cart, then update the qty needed
        for (var i = 0; i < cartItems.length; i++) {
            if (item.itemId == cartItems[i].itemId) {
                cartItems[i].amountNeeded += item.amountNeeded;
                itemFound = true;
                break;
            }
        }

        //if item wasn't found then add it to cart
        if (!itemFound) {
            cartItems.push(item);
        }
    }


    return {
        getCartItems: getCartItems,
        addCartItem: addCartItem,
        clearCart: clearCart,
    }
}]);