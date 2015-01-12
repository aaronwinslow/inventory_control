angular.module('InventoryApp').factory('UserServices',
    ['$http', '$q', '$rootScope',
function ($http, $q, $rootScope) {

    var users = [];
    var user = {};
    var departments = [];
    var errors = [];

    var serviceName = 'user';

    //define event messages
    var eventUsersAllReceived = serviceName + ':all-users-received';
    var eventUserLookupsReceived = serviceName + ':user-lookups-received';
    
    var eventUserSaveError = serviceName + ':user-save-error';
    var eventUserReceived = serviceName + ':user-received';
    var eventUserAdded = serviceName + ':user-added';
    var eventUserUpdated = serviceName + ':user-updated';
    var eventUserDeleted = serviceName + ':user-deleted';
    var eventUserServiceError = serviceName + ':error';
    var eventDepartmentsReceived = serviceName + ':departments-received';

    //return a empty object to fill for post of new user
    var NewUser = function () {
        user = {
            userId: "",
            userName: "",
            firstName: "",
            lastName: "",
            departmentId: 0,
            departmentName: "",
            email: ""
        };

        return user;
    }

    var getUsersAll = function () {
        //setup promise
        var q = $q.defer();

        $http.get('/user/all')
        .success(function (data) {
            q.resolve(data);
        })
        .error(function (status) {
            q.reject(status);
        });

        q.promise
       .then(function (data) {
           users.length = 0;

           for (var i in data.users) {
               users.push(data.users[i]);
           }

           $rootScope.$broadcast(eventUsersAllReceived);

       }, function (error) {
           errors.push({ error: error, timeStamp: new Date() });
           $rootScope.$broadcast(eventUserServiceError);

       });
    }



    var getUser = function (userId) {
        //setup promise
        var q = $q.defer();

        $http.get('/user/' + userId)
        .success(function (data) {
            q.resolve(data);
        })
        .error(function (status) {
            q.reject(status);
        });

        q.promise
       .then(function (data) {
           user = data.users[0];
           departments = data.departments.departments;
           
           $rootScope.$broadcast(eventUserReceived);

       }, function (error) {
           errors.push({ error: error, timeStamp: new Date() });
           $rootScope.$broadcast(eventUserServiceError);
       });
    }


    var getDepartments = function () {
        //setup promise
        var q = $q.defer();

        $http.get('/user/departments')
        .success(function (data) {
            q.resolve(data);
        })
        .error(function (status) {
            q.reject(status);
        });

        q.promise
       .then(function (data) {
           departments = data.departments;

           $rootScope.$broadcast(eventDepartmentsReceived);

       }, function (error) {
           errors.push({ error: error, timeStamp: new Date() });
           $rootScope.$broadcast(eventUserServiceError);
       });
    }

    var postUser = function (userToUpdate) {
        //setup promise
        var q = $q.defer();

        user = userToUpdate;

        $http.post('/user/update',
            user,
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
           user = data.users[0];
           //departments = data.departments.departments;

           if (!user.isUserSaveError) {
               $rootScope.$broadcast(eventUserUpdated);
           } else {
               $rootScope.$broadcast(eventUserSaveError);
           }


       }, function (error) {
           errors.push({ error: error, timeStamp: new Date() });
           $rootScope.$broadcast(eventUserServiceError);
       });
    }


    var postUserPassword = function (userToUpdate) {
        //setup promise
        var q = $q.defer();

        user = userToUpdate;

        $http.post('/user/updatepassword',
            user,
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
           user = data.users[0];
           //departments = data.departments.departments;

           if (!user.isUserSaveError) {
               $rootScope.$broadcast(eventUserUpdated);
           } else {
               $rootScope.$broadcast(eventUserSaveError);
           }


       }, function (error) {
           errors.push({ error: error, timeStamp: new Date() });
           $rootScope.$broadcast(eventUserServiceError);
       });
    }


    var deleteUser = function (userToUpdate) {
        //setup promise
        var q = $q.defer();

        user = userToUpdate;

        $http.post('/user/remove',
            userToUpdate,
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
           user = NewUser();

           $rootScope.$broadcast(eventUserDeleted);

       }, function (error) {
           errors.push({ error: error, timeStamp: new Date() });
           $rootScope.$broadcast(eventUserServiceError);
       });
    }

    var getUserLookups = function () {
        //setup promise
        var q = $q.defer();

        $http.get('/user/lookup')
        .success(function (data) {
            q.resolve(data);
        })
        .error(function (status) {
            q.reject(status);
        });

        q.promise
       .then(function (data) {
           lookups = data;

           $rootScope.$broadcast(eventUserLookupsReceived);

       }, function (error) {
           errors.push({ error: error, timeStamp: new Date() });
           $rootScope.$broadcast(eventUserServiceError);
       });
    }

    var isValidUser = function () {
        if (user.hasOwnProperty('userId')) {
            if (user.userId > 0) {
                return true;
            }
        }

        return false;
    }

    var Users = function () {
        return users;
    }

    var User = function () {
        return user;
    }

    var Lookups = function () {
        return lookups;
    }

    var Departments = function () {
        return departments;
    }

    return {
        getUsersAll: getUsersAll,
        getUser: getUser,
        getDepartments: getDepartments,
        getUserLookups: getUserLookups,
        postUser: postUser,
        postUserPassword: postUserPassword,
        deleteUser: deleteUser,
        Users: Users,
        User: User,
        Lookups: Lookups,
        NewUser: NewUser,
        isValidUser: isValidUser,
        Departments: Departments,

        eventUserSaveError: eventUserSaveError,
        eventUsersAllReceived: eventUsersAllReceived,
        eventUserLookupsReceived: eventUserLookupsReceived,
        eventUserReceived: eventUserReceived,
        eventUserUpdated: eventUserUpdated,
        eventUserDeleted: eventUserDeleted,
        eventUserServiceError: eventUserServiceError,
        eventDepartmentsReceived: eventDepartmentsReceived,
    }
}]);