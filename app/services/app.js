/// <reference path="D:\STORE_develop\bootcamp\inventory_control\inventory_control\Scripts/_references.js" />

angular.module('InventoryApp', ['ngRoute', 'ui.bootstrap'])

.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {

    ///////////////////////////////////////////////////////////////////////////////////
    // Home controller will redirect to the appropriate home page based on privilege //
    ///////////////////////////////////////////////////////////////////////////////////

    $routeProvider.when('/', {        //home view
        templateUrl: 'views/HomeView.html',
        controller: 'HomeController',
        caseInsensitiveMatch: true,
        title: 'Home',
        activetab: 'home'
    }).when('/login', {      //view login
        templateUrl: 'views/LoginView.html',
        controller: 'LoginController',
        caseInsensitiveMatch: true,
        title: 'Login',
        activetab: 'login'
    }).when('/locitems', {      //view location items
        templateUrl: 'views/LocationItemsView.html',
        controller: 'LocationItemsController',
        caseInsensitiveMatch: true,
        title: 'Location Items',
        activetab: 'locitems'
    }).when('/ordersa', {      //view admin orders / view of all orders
        templateUrl: 'views/ordersView.html',
        controller: 'OrdersController',
        caseInsensitiveMatch: true,
        title: 'Order Maintenance',
        activetab: 'ordersa'
    }).when('/users', {      //view users
        templateUrl: 'views/UsersView.html',
        controller: 'UsersController',
        caseInsensitiveMatch: true,
        title: 'User Maintenance',
        activetab: 'users'
    }).when('/items', {      //view items
        templateUrl: 'views/ItemsView.html',
        controller: 'ItemsController',
        caseInsensitiveMatch: true,
        title: 'Items',
        activetab: 'items'
    }).when('/locitem/:id', {      //view location item
        templateUrl: 'views/LocationItemView.html',
        controller: 'LocationItemController',
        caseInsensitiveMatch: true,
        title: 'Location Item',
        activetab: 'locitem'
    }).when('/ordera/:id', {      //view individual order / admin view of individual order
        templateUrl: 'views/OrderView.html',
        controller: 'OrderController',
        caseInsensitiveMatch: true,
        title: 'Order',
        activetab: 'ordera'
    }).when('/user/:id', {      //view location item
        templateUrl: 'views/UserView.html',
        controller: 'UserController',
        caseInsensitiveMatch: true,
        title: 'User',
        activetab: 'user'
    }).when('/item/:id', {      //view individual item
        templateUrl: 'views/ItemView.html',
        controller: 'ItemController',
        caseInsensitiveMatch: true,
        title: 'Item',
        activetab: 'item'
    }).when('/userhome', {      //view user home
        templateUrl: 'views/UserHomeView.html',
        controller: 'UserHomeController',
        caseInsensitiveMatch: true,
        title: 'Home',
        activetab: 'userhome'
    }).when('/adminhome', {      //view administrator home
        templateUrl: 'views/AdminHomeView.html',
        controller: 'AdminHomeController',
        caseInsensitiveMatch: true,
        title: 'Home',
        activetab: 'adminhome'
    }).when('/userorder', {      //view location item
        templateUrl: 'views/UserOrderView.html',
        controller: 'UserOrderController',
        caseInsensitiveMatch: true,
        title: 'Order',
        activetab: 'userorder'
    }).when('/usercart', {      //view user cart
        templateUrl: 'views/UserCartView.html',
        controller: 'UserCartController',
        caseInsensitiveMatch: true,
        title: 'Cart',
        activetab: 'usercart'
    }).when('/email', {      //view email
        templateUrl: 'views/EmailTest.html',
        controller: 'UserController',
        caseInsensitiveMatch: true,
        title: 'Email',
        activetab: 'email'
    }).when('/password', {      //view email
        templateUrl: 'views/PasswordView.html',
        controller: 'UserController',
        caseInsensitiveMatch: true,
        title: 'Password',
        activetab: ''
    }).otherwise('/');

    $httpProvider.interceptors.push('AuthFactory');
}]);


//filter for pagination functionality
angular.module('InventoryApp').filter('startFrom', function () {
    return function (input, start) {
        if (input) {
            start = +start;
            return input.slice(start);
        }
        return [];
    };
});

angular.module('InventoryApp')
.run();