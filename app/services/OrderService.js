angular.module('InventoryApp').factory('OrderService',
    ['$http', '$q', '$rootScope',
function ($http, $q, $rootScope) {

    var orders = [];
    var order = {};
    var errors = [];

    var serviceName = 'order';

    //define event messages
    var eventOrdersAllReceived = serviceName + ':all-orders-received';
    var eventOrderLookupsReceived = serviceName + ':order-lookups-received';

    var eventOrderReceived = serviceName + ':order-received';
    var eventOrderAdded = serviceName + ':order-added';
    var eventOrderUpdated = serviceName + ':order-updated';
    var eventOrderDeleted = serviceName + ':order-deleted';
    var eventOrderServiceError = serviceName + ':error';

    //return a empty object to fill for post of new order
    var NewOrder = function () {
        var order = {
            orderId: -1,
            itemId: 0,
            itemName: "",
            userId: "",
            firstName: "",
            lastName: "",
            departmentId: 0,
            departmentName: "",
            orderQuantity: 0,
            beginTimestamp: new Date(),
            endTimestamp: null,
            isComplete: false,
            userDeleted: false,
            adminConfirmedDelete: false,
            isDenied: false,
            isApproved: false,
            deniedReason: null
        };

        return order;
    }

    var getOrdersAll = function () {
        //setup promise
        var q = $q.defer();

        $http.get('/order/all')
        .success(function (data) {
            q.resolve(data);
        })
        .error(function (status) {
            q.reject(status);
        });

        q.promise
       .then(function (data) {
           orders.length = 0;

           for (var i in data.orders) {
               orders.push(data.orders[i]);
           }

           $rootScope.$broadcast(eventOrdersAllReceived);

       }, function (error) {
           errors.push({ error: error, timeStamp: new Date() });
           $rootScope.$broadcast(eventOrderServiceError);

       });
    }



    var getOrder = function (orderId) {
        //setup promise
        var q = $q.defer();

        $http.get('/order/' + orderId)
        .success(function (data) {
            q.resolve(data);
        })
        .error(function (status) {
            q.reject(status);
        });

        q.promise
       .then(function (data) {
           order = data.orders[0];

           $rootScope.$broadcast(eventOrderReceived);

       }, function (error) {
           errors.push({ error: error, timeStamp: new Date() });
           $rootScope.$broadcast(eventOrderServiceError);
       });
    }

    var getOrderByUserId = function (userId) {
        //setup promise
        var q = $q.defer();

        $http.get('/order/user/' + userId)
        .success(function (data) {
            q.resolve(data);
        })
        .error(function (status) {
            q.reject(status);
        });

        q.promise
       .then(function (data) {
           orders = data.orders;

           $rootScope.$broadcast(eventOrderReceived);

       }, function (error) {
           errors.push({ error: error, timeStamp: new Date() });
           $rootScope.$broadcast(eventOrderServiceError);
       });
    }


    var updateOrder = function (orderToUpdate) {
        //setup promise
        var q = $q.defer();

        order = orderToUpdate;

        $http.post('/order/update',
            order,
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
           order = data.orders[0];

           $rootScope.$broadcast(eventOrderReceived);

       }, function (error) {
           errors.push({ error: error, timeStamp: new Date() });
           $rootScope.$broadcast(eventOrderServiceError);
       });
    }


    var createOrder = function (orderToUpdate) {
        //setup promise
        var q = $q.defer();

        order = orderToUpdate;

        $http.post('/order/create',
            order,
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
           order = data.orders[0];

           $rootScope.$broadcast(eventOrderReceived);

       }, function (error) {
           errors.push({ error: error, timeStamp: new Date() });
           $rootScope.$broadcast(eventOrderServiceError);
       });
    }

    var deleteOrder = function (orderToUpdate) {
        //setup promise
        var q = $q.defer();

        order = orderToUpdate;

        $http.post('/order/remove',
            orderToUpdate,
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
           order = NewOrder();

           $rootScope.$broadcast(eventOrderDeleted);

       }, function (error) {
           errors.push({ error: error, timeStamp: new Date() });
           $rootScope.$broadcast(eventOrderServiceError);
       });
    }

    var getOrderLookups = function () {
        //setup promise
        var q = $q.defer();

        $http.get('/order/lookup')
        .success(function (data) {
            q.resolve(data);
        })
        .error(function (status) {
            q.reject(status);
        });

        q.promise
       .then(function (data) {
           lookups = data;

           $rootScope.$broadcast(eventOrderLookupsReceived);

       }, function (error) {
           errors.push({ error: error, timeStamp: new Date() });
           $rootScope.$broadcast(eventOrderServiceError);
       });
    }

    var isValidOrder = function () {
        if (order.hasOwnProperty('orderId')) {
            if (order.orderId > 0) {
                return true;
            }
        }

        return false;
    }

    var Orders = function () {
        return orders;
    }

    var Order = function () {
        return order;
    }

    var Lookups = function () {
        return lookups;
    }

    return {
        getOrdersAll: getOrdersAll,
        getOrder: getOrder,
        getOrderByUserId: getOrderByUserId,
        getOrderLookups: getOrderLookups,
        updateOrder: updateOrder,
        createOrder: createOrder,
        deleteOrder: deleteOrder,
        Orders: Orders,
        Order: Order,
        Lookups: Lookups,
        NewOrder: NewOrder,
        isValidOrder: isValidOrder,

        eventOrdersAllReceived: eventOrdersAllReceived,
        eventOrderLookupsReceived: eventOrderLookupsReceived,
        eventOrderReceived: eventOrderReceived,
        eventOrderUpdated: eventOrderUpdated,
        eventOrderDeleted: eventOrderDeleted,
        eventOrderServiceError: eventOrderServiceError,
    }
}]);