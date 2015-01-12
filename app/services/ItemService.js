angular.module('InventoryApp').factory('ItemServices',
    ['$http', '$q', '$rootScope',
function ($http, $q, $rootScope) {
    var items = [];
    var suppliers = [];
    var supplierParts = [];
    var item = {};
    var errors = [];

    var serviceName = 'item';

    //define event messages
    var eventItemsAllReceived = serviceName + ':all-items-received';
    var eventItemLookupsReceived = serviceName + ':item-lookups-received';

    var eventItemReceived = serviceName + ':item-received';
    var eventItemAdded = serviceName + ':item-added';
    var eventItemUpdated = serviceName + ':item-updated';
    var eventItemDeleted = serviceName + ':item-deleted';
    var eventItemServiceError = serviceName + ':error';

    //return a emtpy object to fill for post of new item
    var NewItem = function () {
        item = {
            itemId: -1,
            itemName: ""
        };

        return item;
    }

    var getItemsAll = function () {
        //setup promise
        var q = $q.defer();

        $http.get('/item/all')
        .success(function (data) {
            q.resolve(data);
        })
        .error(function (status) {
            q.reject(status);
        });

        q.promise
       .then(function (data) {
           items.length = 0;

           for (var i in data.items) {
               items.push(data.items[i]);
           }

           $rootScope.$broadcast(eventItemsAllReceived);

       }, function (error) {
           errors.push({ error: error, timeStamp: new Date() });
           $rootScope.$broadcast(eventItemServiceError);

       });
    }


    var getItem = function (itemId) {
        //setup promise
        var q = $q.defer();

        $http.get('/item/' + itemId)
        .success(function (data) {
            q.resolve(data);
        })
        .error(function (status) {
            q.reject(status);
        });

        q.promise
       .then(function (data) {
           item = data.items[0];
           suppliers = data.suppliers.suppliers;
           supplierParts = data.supplierParts.supplierParts;

           $rootScope.$broadcast(eventItemReceived);

       }, function (error) {
           errors.push({ error: error, timeStamp: new Date() });
           $rootScope.$broadcast(eventItemServiceError);
       });
    }


    var postItem = function (itemToUpdate) {
        //setup promise
        var q = $q.defer();

        item = itemToUpdate;

        $http.post('/item/post',
            item,
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
           item = data;

           $rootScope.$broadcast(eventItemReceived);

       }, function (error) {
           errors.push({ error: error, timeStamp: new Date() });
           $rootScope.$broadcast(eventItemServiceError);
       });
    }


    var deleteItem = function (itemToUpdate) {
        //setup promise
        var q = $q.defer();

        item = itemToUpdate;

        $http.post('/item/remove',
            itemToUpdate,
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
           item = NewItem();

           $rootScope.$broadcast(eventItemDeleted);

       }, function (error) {
           errors.push({ error: error, timeStamp: new Date() });
           $rootScope.$broadcast(eventItemServiceError);
       });
    }

    var getItemLookups = function () {
        //setup promise
        var q = $q.defer();

        $http.get('/item/lookup')
        .success(function (data) {
            q.resolve(data);
        })
        .error(function (status) {
            q.reject(status);
        });

        q.promise
       .then(function (data) {
           lookups = data;

           $rootScope.$broadcast(eventItemLookupsReceived);

       }, function (error) {
           errors.push({ error: error, timeStamp: new Date() });
           $rootScope.$broadcast(eventItemServiceError);
       });
    }

    var isValidItem = function () {
        if (item.hasOwnProperty('itemId')) {
            if (item.itemId > 0) {
                return true;
            }
        }

        return false;
    }

    var Items = function () {
        return items;
    }

    var Item = function () {
        return item;
    }

    var Suppliers = function () {
        return suppliers;
    }

    var SupplierParts = function () {
        return supplierParts;
    }

    var Lookups = function () {
        return lookups;
    }

    return {
        getItemsAll: getItemsAll,
        getItem: getItem,
        getItemLookups: getItemLookups,
        postItem: postItem,
        deleteItem: deleteItem,
        Items: Items,
        Item: Item,
        Lookups: Lookups,
        NewItem: NewItem,
        isValidItem: isValidItem,
        SupplierParts: SupplierParts,
        Suppliers: Suppliers,

        eventItemsAllReceived: eventItemsAllReceived,
        eventItemLookupsReceived: eventItemLookupsReceived,
        eventItemReceived: eventItemReceived,
        eventItemUpdated: eventItemUpdated,
        eventItemDeleted: eventItemDeleted,
        eventItemServiceError: eventItemServiceError,
    }
}]);