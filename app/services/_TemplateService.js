angular.module('InventoryApp').factory('WidgetServices',
    ['$http', '$q', '$rootScope',
function ($http, $q, $rootScope) {

    var widgets = [];
    var widget = {};
    var errors = [];

    var serviceName = 'widget';

    //define event messages
    var eventWidgetsAllReceived = serviceName + ':all-widgets-received';
    var eventWidgetLookupsReceived = serviceName + ':widget-lookups-received';

    var eventWidgetReceived = serviceName + ':widget-received';
    var eventWidgetAdded = serviceName + ':widget-added';
    var eventWidgetUpdated = serviceName + ':widget-updated';
    var eventWidgetDeleted = serviceName + ':widget-deleted';
    var eventWidgetServiceError = serviceName + ':error';

    //return a emtpy object to fill for post of new widget
    var NewWidget = function () {
        widget = {
            widgetId: -1,
            widgetName: ""
        };

        return widget;
    }

    var getWidgetsAll = function () {
        //setup promise
        var q = $q.defer();

        $http.get('/widget/all')
        .success(function (data) {
            q.resolve(data);
        })
        .error(function (status) {
            q.reject(status);
        });

        q.promise
       .then(function (data) {
           widgets.length = 0;

           for (var i in data.widgets) {
               widgets.push(data.widgets[i]);
           }

           $rootScope.$broadcast(eventWidgetsAllReceived);

       }, function (error) {
           errors.push({ error: error, timeStamp: new Date() });
           $rootScope.$broadcast(eventWidgetServiceError);

       });
    }



    var getWidget = function (widgetId) {
        //setup promise
        var q = $q.defer();

        $http.get('/widget/' + widgetId)
        .success(function (data) {
            q.resolve(data);
        })
        .error(function (status) {
            q.reject(status);
        });

        q.promise
       .then(function (data) {
           widget = data;

           $rootScope.$broadcast(eventWidgetReceived);

       }, function (error) {
           errors.push({ error: error, timeStamp: new Date() });
           $rootScope.$broadcast(eventWidgetServiceError);
       });
    }


    var postWidget = function (widgetToUpdate) {
        //setup promise
        var q = $q.defer();

        widget = widgetToUpdate;

        $http.post('/widget/post',
            widget,
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
           widget = data;

           $rootScope.$broadcast(eventWidgetReceived);

       }, function (error) {
           errors.push({ error: error, timeStamp: new Date() });
           $rootScope.$broadcast(eventWidgetServiceError);
       });
    }


    var deleteWidget = function (widgetToUpdate) {
        //setup promise
        var q = $q.defer();

        widget = widgetToUpdate;

        $http.post('/widget/remove',
            widgetToUpdate,
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
           widget = NewWidget();

           $rootScope.$broadcast(eventWidgetDeleted);

       }, function (error) {
           errors.push({ error: error, timeStamp: new Date() });
           $rootScope.$broadcast(eventWidgetServiceError);
       });
    }

    var getWidgetLookups = function () {
        //setup promise
        var q = $q.defer();

        $http.get('/widget/lookup')
        .success(function (data) {
            q.resolve(data);
        })
        .error(function (status) {
            q.reject(status);
        });

        q.promise
       .then(function (data) {
           lookups = data;

           $rootScope.$broadcast(eventWidgetLookupsReceived);

       }, function (error) {
           errors.push({ error: error, timeStamp: new Date() });
           $rootScope.$broadcast(eventWidgetServiceError);
       });
    }

    var isValidWidget = function () {
        if (widget.hasOwnProperty('widgetId')) {
            if (widget.widgetId > 0) {
                return true;
            }
        }

        return false;
    }

    var Widgets = function () {
        return widgets;
    }

    var Widget = function () {
        return widget;
    }

    var Lookups = function () {
        return lookups;
    }

    return {
        getWidgetsAll: getWidgetsAll,
        getWidget: getWidget,
        getWidgetLookups: getWidgetLookups,
        postWidget: postWidget,
        deleteWidget: deleteWidget,
        Widgets: Widgets,
        Widget: Widget,
        Lookups: Lookups,
        NewWidget: NewWidget,
        isValidWidget: isValidWidget,

        eventWidgetsAllReceived: eventWidgetsAllReceived,
        eventWidgetLookupsReceived: eventWidgetLookupsReceived,
        eventWidgetReceived: eventWidgetReceived,
        eventWidgetUpdated: eventWidgetUpdated,
        eventWidgetDeleted: eventWidgetDeleted,
        eventWidgetServiceError: eventWidgetServiceError,
    }
});