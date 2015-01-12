angular.module('InventoryApp').factory('LocationItemServices', 
    ['$http', '$q', '$rootScope',
function ($http, $q, $rootScope) {
    var locationItems = [];
    var locations = [];
    var location = {};
    var errors = [];

    var serviceName = 'location';

    //define event messages
    var eventLocationsAllReceived = serviceName + ':all-location-received';
    var eventLocationReceived = serviceName + ':location-received';
    var eventLocationItemLookupsReceived = serviceName + ':locationItem-lookups-received';

    var eventLocationItemsReceived = serviceName + ':locationItem-received';
    var eventLocationItemAdded = serviceName + ':locationItem-added';
    var eventLocationItemUpdated = serviceName + ':locationItem-updated';
    var eventLocationItemDeleted = serviceName + ':locationItem-deleted';
    var eventLocationItemServiceError = serviceName + ':error';

    //return a emtpy object to fill for post of new locationItem
    var NewLocationItem = function () {
       var locationItem = {
           itemLocationXrefId: 0,
           itemId: 0,
           itemName: "",
           locationId: 0,
           locationName: "",
           quantityOnPallet: 0,
           isDeleted: false,
           isNew: false
        };

        return locationItem;
    }

    var getLocationsAll = function () {
        //setup promise
        var q = $q.defer();

        $http.get('/location/locations')
        .success(function (data) {
            q.resolve(data);
        })
        .error(function (status) {
            q.reject(status);
        });

        q.promise
       .then(function (data) {
           locations.length = 0;

           for (var i in data.locations) {
               locations.push(data.locations[i]);
           }

           $rootScope.$broadcast(eventLocationsAllReceived);

       }, function (error) {
           errors.push({ error: error, timeStamp: new Date() });
           $rootScope.$broadcast(eventLocationItemServiceError);

       });
    }


    var getLocationItemsByLocation = function (locationId) {
        //setup promise
        var q = $q.defer();

        $http.get('/location/locitemsbylocation/' + locationId)
        .success(function (data) {
            q.resolve(data);
        })
        .error(function (status) {
            q.reject(status);
        });

        q.promise
       .then(function (data) {
           locationItems = data.locationItems;

           $rootScope.$broadcast(eventLocationItemsReceived);

       }, function (error) {
           errors.push({ error: error, timeStamp: new Date() });
           $rootScope.$broadcast(eventLocationItemServiceError);

       });
    }


    var getLocationItemsByItem = function (itemId) {
        //setup promise
        var q = $q.defer();

        $http.get('/location/locitemsbyitem/' + itemId)
        .success(function (data) {
            q.resolve(data);
        })
        .error(function (status) {
            q.reject(status);
        });

        q.promise
       .then(function (data) {
           locationItems = data.locationItems;

           $rootScope.$broadcast(eventLocationItemsReceived);

       }, function (error) {
           errors.push({ error: error, timeStamp: new Date() });
           $rootScope.$broadcast(eventLocationItemServiceError);

       });
    }


    var getLocation = function (locationId) {
        //setup promise
        var q = $q.defer();

        $http.get('/location/' + locationId)
        .success(function (data) {
            q.resolve(data);
        })
        .error(function (status) {
            q.reject(status);
        });

        q.promise
       .then(function (data) {
           location = data.locations[0];

           $rootScope.$broadcast(eventLocationReceived);

       }, function (error) {
           errors.push({ error: error, timeStamp: new Date() });
           $rootScope.$broadcast(eventLocationItemServiceError);
       });
    }


    var postLocationItemsForLocation = function (locationItemsToUpdate, locationId) {
        //setup promise
        var q = $q.defer();

        locationItems = locationItemsToUpdate;

        $http.post('/location/save/loctiemsforlocation',
            {
                locationId: locationId,
                locationItems: locationItems
            },
            {
                headers: { 'Content-Type': 'application/json' },
            })
        .success(function (data) {
            q.resolve(data);
        })
        .error(function (status) {
            q.reject(status);
        });

        q.promise
       .then(function (data) {
           locationItems = data.locationItems;

           $rootScope.$broadcast(eventLocationItemsReceived);

       }, function (error) {
           errors.push({ error: error, timeStamp: new Date() });
           $rootScope.$broadcast(eventLocationItemServiceError);
       });
    }



    var postLocationItemsForItem = function (locationItemsToUpdate, itemId) {
        //setup promise
        var q = $q.defer();

        locationItems = locationItemsToUpdate;

        $http.post('/location/save/loctiemsforitem',
            {
                itemId: itemId,
                locationItems: locationItems
            },
            {
                headers: { 'Content-Type': 'application/json' },
            })
        .success(function (data) {
            q.resolve(data);
        })
        .error(function (status) {
            q.reject(status);
        });

        q.promise
       .then(function (data) {
           locationItems = data.locationItems;

           $rootScope.$broadcast(eventLocationItemsReceived);

       }, function (error) {
           errors.push({ error: error, timeStamp: new Date() });
           $rootScope.$broadcast(eventLocationItemServiceError);
       });
    }

    var deleteLocationItem = function (locationItemToUpdate) {
        //setup promise
        var q = $q.defer();

        locationItem = locationItemToUpdate;

        $http.post('/location/remove',
            locationItemToUpdate,
            {
                headers: { 'Content-Type': 'application/json' },
            })
        .success(function (data) {
            q.resolve(data);
        })
        .error(function (status) {
            q.reject(status);
        });

        q.promise
       .then(function (data) {
           locationItem = NewLocationItem();

           $rootScope.$broadcast(eventLocationItemDeleted);

       }, function (error) {
           errors.push({ error: error, timeStamp: new Date() });
           $rootScope.$broadcast(eventLocationItemServiceError);
       });
    }

    var getLocationItemLookups = function () {
        //setup promise
        var q = $q.defer();

        $http.get('/location/lookup')
        .success(function (data) {
            q.resolve(data);
        })
        .error(function (status) {
            q.reject(status);
        });

        q.promise
       .then(function (data) {
           lookups = data;

           $rootScope.$broadcast(eventLocationItemLookupsReceived);

       }, function (error) {
           errors.push({ error: error, timeStamp: new Date() });
           $rootScope.$broadcast(eventLocationItemServiceError);
       });
    }

    var isValidLocationItem = function () {
        if (locationItem.hasOwnProperty('locationItemId')) {
            if (locationItem.locationItemId > 0) {
                return true;
            }
        }

        return false;
    }

    var LocationItems = function () {
        return locationItems;
    }

    var LocationItem = function () {
        return locationItem;
    }


    var Locations = function () {
        return locations;
    }

    var Location = function () {
        return location;
    }

    var Lookups = function () {
        return lookups;
    }

    return {
        getLocationsAll: getLocationsAll,
        //getLocationItemsAll: getLocationItemsAll,
        getLocation: getLocation,
        getLocationItemsByItem: getLocationItemsByItem,
        getLocationItemsByLocation: getLocationItemsByLocation,
        getLocationItemLookups: getLocationItemLookups,
        postLocationItemsForItem: postLocationItemsForItem,
        postLocationItemsForLocation: postLocationItemsForLocation,
        deleteLocationItem: deleteLocationItem,

        Locations: Locations,
        Location: Location,
        LocationItems: LocationItems,
        LocationItem: LocationItem,
        Lookups: Lookups,

        NewLocationItem: NewLocationItem,

        isValidLocationItem: isValidLocationItem,

        eventLocationsAllReceived: eventLocationsAllReceived,
        eventLocationReceived: eventLocationReceived,
        eventLocationItemLookupsReceived: eventLocationItemLookupsReceived,
        eventLocationItemsReceived: eventLocationItemsReceived,
        eventLocationItemUpdated: eventLocationItemUpdated,
        eventLocationItemDeleted: eventLocationItemDeleted,
        eventLocationItemServiceError: eventLocationItemServiceError,
    }
}]);