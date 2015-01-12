angular.module('InventoryApp')
.controller('ItemController',
    ['$scope', '$q', '$location', '$routeParams', 'ItemServices', 'LocationItemServices', 'AuthServices',       //add services names in single quotes
function ($scope, $q, $location, $routeParams, ItemServices, LocationItemServices, AuthServices) {    //add service names as params

    var vm = $scope;

    AuthServices.AuthInit(AuthServices.roleAdmin);

    vm.item = {};
     
    vm.itemId = $routeParams.id;
    ItemServices.getItem(vm.itemId);

    vm.$on(ItemServices.eventItemReceived, function () {
        vm.item = ItemServices.Item();
        vm.suppliers = ItemServices.Suppliers();
        vm.supplierParts = ItemServices.SupplierParts();
    });


    vm.location = {};
    vm.locationItems = [];
    vm.items = [];
    vm.locations = [];
    vm.editItemIndex = -1;
    vm.disableAddNew = false;
    vm.needToGetLocationData = false;

    LocationItemServices.getLocationsAll();
    LocationItemServices.getLocationItemsByItem(vm.itemId);

    vm.$on(LocationItemServices.eventLocationsAllReceived, function () {
        vm.locations = LocationItemServices.Locations();
    })

    vm.$on(LocationItemServices.eventLocationItemsReceived, function () {
        vm.locationItems = LocationItemServices.LocationItems();

        if (vm.needToGetLocationData) {
            vm.needToGetLocationData = false;
            LocationItemServices.getLocationsAll();
            ItemServices.getItem(vm.itemId);
        }
    })

    vm.deleteLocationItem = function (locationItem) {
        locationItem.isDeleted = true;
        vm.needToGetLocationData = true;
        LocationItemServices.postLocationItemsForItem(vm.locationItems, vm.itemId);
    }

    vm.editLocationItem = function (locationItem) {
        vm.editItemIndex = locationItem.itemLocationXrefId;

        vm.disableAddNew = true;
    }

    vm.saveLocationItem = function (locationItem) {
        vm.editItemIndex = -1;
        vm.needToGetLocationData = true;

        LocationItemServices.postLocationItemsForItem(vm.locationItems, vm.itemId);

        vm.disableAddNew = false;   
    }

    vm.cancelEditLocationItem = function (locationItem) {
        //if (vm.locationItems[index].isNew) {
        //    vm.locationItems.splice(index, 1);
        //}

        vm.editItemIndex = -1;
        vm.disableAddNew = false;

        LocationItemServices.getLocationItemsByItem(vm.itemId);
    }

    vm.newLocationItem = function () {
        vm.predicate = 'itemLocationXrefId';
        vm.reverse = false;
        vm.editItemIndex = 0;

        var item = LocationItemServices.NewLocationItem();

        item.isNew = true;
        item.locationName = 0;
        item.locationId = 0;
        item.itemName = vm.item.itemName;
        item.itemId = vm.itemId;
        item.quantityOnPallet = vm.item.quantityPerPallet;
        item.itemLocationXrefId = 0;

        if (vm.locationItems.length == 0) {
            vm.locationItems.push(item);
        } else {
            vm.locationItems.unshift(item);
        }


        vm.disableAddNew = true;
    }

    vm.locationAvailable = function (itemLocationId) {
        return function (location) {
            return location.palletsRemaining > 0 || location.locationId == itemLocationId;
        }
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

    vm.backToView = function() {
        $location.path('/items');
    }

}]);