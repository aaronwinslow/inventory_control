angular.module('InventoryApp')
.controller('LocationItemController',
    ['$scope', '$q', '$location', '$routeParams', 'LocationItemServices', 'AuthServices',       //add services names in single quotes
function ($scope, $q, $location, $routeParams, LocationItemServices, AuthServices) {    //add service names as params

    var vm = $scope;

    AuthServices.AuthInit(AuthServices.roleAdmin);

    vm.locationId = $routeParams.id;

    vm.location = {};
    vm.locationItems = [];
    vm.items = [];
    vm.locations = [];
    vm.editItemIndex = -1;
    vm.disableAddNew = false;
    vm.needToGetLocationData = false;

    LocationItemServices.getLocation(vm.locationId);
    LocationItemServices.getLocationsAll();

    vm.$on(LocationItemServices.eventLocationReceived, function () {
        vm.location = LocationItemServices.Location();
        vm.locationItems = vm.location.locationItems.locationItems;
        vm.items = vm.location.items.items;
    })

    vm.$on(LocationItemServices.eventLocationsAllReceived, function () {
        vm.locations = LocationItemServices.Locations();
    })

    vm.$on(LocationItemServices.eventLocationItemsReceived, function () {
        vm.locationItems = LocationItemServices.LocationItems();

        if (vm.needToGetLocationData) {
            vm.needToGetLocationData = false;
            LocationItemServices.getLocation(vm.locationId);
        }
    })

    vm.deleteLocationItem = function (locationItem) {
        locationItem.isDeleted = true;
        vm.needToGetLocationData = true;
        LocationItemServices.postLocationItemsForLocation(vm.locationItems, vm.location.locationId);
    }

    vm.editLocationItem = function (locationItem) {
        vm.editItemIndex = locationItem.itemLocationXrefId;

        vm.disableAddNew = true;
    }

    vm.saveLocationItem = function (locationItem) {
        vm.editItemIndex = -1;
        vm.needToGetLocationData = true;

        LocationItemServices.postLocationItemsForLocation(vm.locationItems, vm.location.locationId);

        vm.disableAddNew = false;
    }

    vm.cancelEditLocationItem = function (locationItem) {
        vm.editItemIndex = -1;
        vm.disableAddNew = false;

        LocationItemServices.getLocation(vm.locationId);
    }

    vm.newLocationItem = function () {
        vm.predicate = 'itemLocationXrefId';
        vm.reverse = false;
        vm.editItemIndex = 0;

        var item = LocationItemServices.NewLocationItem();
        item.isNew = true;
        item.locationName = vm.location.locationName;
        item.locationId = vm.location.locationId;
        item.itemLocationXrefId = 0;

        vm.locationItems.unshift(item);

        vm.disableAddNew = true;
    }


    vm.locationAvailable = function () {
        return function (location) {
            return location.palletsRemaining > 0;
        }
    };

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

    vm.backToLocationItemsView = function () {
        $location.path('/locitems');
    }

}]);