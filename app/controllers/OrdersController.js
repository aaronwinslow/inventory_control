﻿angular.module('InventoryApp')
.controller('OrdersController',
    ['$scope', '$q', '$location', '$routeParams', 'OrderService', 'AuthServices', 'filterFilter',       //add services names in single quotes
function ($scope, $q, $location, $routeParams, OrderService, AuthServices, filterFilter) {    //add service names as params

    var vm = $scope;

    //set default column order
    vm.predicate = 'orderId';
    vm.reverse = false;

    vm.completeCheckBox = false;

    AuthServices.AuthInit(AuthServices.roleAdmin);

    vm.orders = [];

    OrderService.getOrdersAll();


    vm.getOrder = function (orderId) {
        $location.path('ordera/' + orderId);
    }

    vm.onlyIncomplete = function (order) {
        if (vm.completeCheckBox == false) {
            return order.isComplete == false;
        }
        else {
            return order.isComplete == true;
        }
    }


    /*===============================================================
Paging Methods and Variables
-----------------------------------------------------------------

Set fields for paging

vm.pageItems  
- to array being paged
vm.pageSearchFields 
- to array of fields allowed in search 
- set to null if all fields allowed
vm.entryLimit
- to desired page size

=================================================================*/
    //var vm = $scope;
    vm.pageItems = vm.orders
    vm.pageSearchFields = ['orderId', 'firstName', 'lastName', 'departmentName']; //['name', 'branch', 'category'];   //['property1', 'property2', 'property3'];
    vm.entryLimit = 10;                          // pageItems per page
    vm.maxPages = 10;

    // create empty search model (object) to trigger $watch on update
    vm.pageSearch = {};

    //stringify an object
    vm.toStringObject = function (o, separator) {
        var h = [];

        if (angular.isArray(o)) {
            for (var i = 0; i < o.length; i++) {
                h.push(vm.toStringObject(o[i], separator));
            }
        } else if (angular.isObject(o)) {
            for (var p in o) {
                h.push(vm.toStringObject(o[p], separator));
            }
        } else {
            h.push(o);
        }

        return h.join(separator);
    }

    vm.createLookupData = function (items, fields) {
        var h = [];

        for (var i = 0; i < items.length; i++) {
            var item = items[i];

            if (fields) {
                if (fields.length > 0) {
                    for (var f = 0; f < fields.length; f++) {
                        h.push(vm.toStringObject(item[fields[f]], ' '));
                    }
                } else {
                    h.push(vm.toStringObject(item, ' '));
                }
            } else {
                h.push(vm.toStringObject(item, ' '));
            }

            item.lookup = h.join(' ');
            h = [];
        }
    }



    vm.resetFilters = function () {
        // needs to be a function or it won't trigger a $watch
        vm.pageSearch = {};
    };

    // pagination controls
    vm.currentPage = 1;
    vm.totalItems = vm.pageItems.length;

    vm.noOfPages = Math.ceil(vm.totalItems / vm.entryLimit);

    // $watch search to update pagination
    vm.$watch('pageSearch', function (newVal, oldVal) {
        vm.filtered = filterFilter(vm.pageItems, newVal);
        vm.totalItems = vm.filtered.length;
        vm.noOfPages = Math.ceil(vm.totalItems / vm.entryLimit);
        vm.currentPage = 1;
    }, true);


    vm.$on(OrderService.eventOrdersAllReceived, function () {
        vm.orders = OrderService.Orders();

        //paging code
        vm.pageItems = vm.orders;
        vm.createLookupData(vm.pageItems, vm.pageSearchFields);
        vm.filtered = filterFilter(vm.pageItems, {});
        vm.totalItems = vm.filtered.length;
        vm.noOfPages = Math.ceil(vm.totalItems / vm.entryLimit);
        vm.currentPage = 1;
    })

}]);