angular.module('InventoryApp')
    .factory('AuthServices', ['$http', '$q', '$location', '$rootScope',
function ($http, $q, $location, $rootScope) {

    //define event messages
    var eventLoginFail = 'login:fail';
    var eventLoginSuccess = 'login:success';
    var eventLogoutFail = 'logout:fail';
    var eventLogoutSuccess = 'logout:success';
    var errors = [];

    

    //////////////////////////////////////////////
    /// Comment out these line for development ///
    //////////////////////////////////////////////
    //var defaultLogin = true;
    //var useRoles = false;

    /////////////////////////////////////////////
    /// Comment out these line for production ///
    /////////////////////////////////////////////
    var defaultLogin = false;
    var useRoles = true;

    var AuthInit = function (roleCheck) {

        if (isLoggedIn()) {
            if (useRoles) {
                if (roleCheck == '') {

                }
                else if (roleCheck == 'general' && isAdmin()) {
                    $location.path('/ordersa');
                } else if (roleCheck == 'admin' && isGeneral()) {
                    $location.path('/userhome');
                } else if (roleCheck == 'password' && isGeneral()) {
                    $location.path('/password');
                }
            }
        } else {
            $location.path('/login');
        }
    }

    //login to the server and store the token if success
    var processLogin = function (username, password) {
        $http({
            url: '/Token',
            contentType: 'application/x-www-form-urlencoded',
            data: 'username=' + username + '&password=' + password + '&grant_type=password',
            method: 'POST'
        }).success(function (data) {
            var token = data.access_token;
            sessionStorage.setItem('userName', data.userName);
            sessionStorage.setItem('userRole', data.userRole);
            sessionStorage.setItem('userId', data.userId);
            sessionStorage.setItem('firstName', data.firstName);
            sessionStorage.setItem('lastName', data.lastName);
            sessionStorage.setItem('email', data.email);
            sessionStorage.setItem('departmentName', data.departmentName);
            sessionStorage.setItem('departmentId', data.departmentId);
            sessionStorage.setItem('token', token);


            $rootScope.$broadcast(eventLoginSuccess);

        }).error(function (data, status) {

            $rootScope.$broadcast(eventLoginFail);
        });
    }

    var processLogout = function () {
        if (token()) {
            $http({
                url: '/api/Account/Logout',
                contentType: 'application/x-www-form-urlencoded',
                data: {}, //'username=' + username + '&password=' + password + '&grant_type=password',
                method: 'POST'
            }).success(function (data) {

                sessionStorage.setItem('userName', '');
                sessionStorage.setItem('userRole', '');
                sessionStorage.setItem('userId', '');
                sessionStorage.setItem('firstName', '');
                sessionStorage.setItem('lastName', '');
                sessionStorage.setItem('email', '');
                sessionStorage.setItem('departmentName', '');
                sessionStorage.setItem('departmentId', '');
                sessionStorage.setItem('token', '');

                $rootScope.$broadcast(eventLogoutSuccess);

            }).error(function (data, status) {

                $rootScope.$broadcast(eventLogoutFail);
            });
        } else {

        }
    }


    var getUsersTypes = function () {
        //setup promise
        var q = $q.defer();

        $http.post('/misc/usertypes')
        .success(function (data) {
            q.resolve(data);
        })
        .error(function (status) {
            q.reject(status);
        });

        q.promise
       .then(function (data) {
           var x = 1;

       }, function (error) {
           var x = 1;
       });
    }


    var userName = function () {
        if (defaultLogin && !sessionStorage.getItem('userName')) {
            return 'admin@email.com';
        } else {
            return sessionStorage.getItem('userName');
        }
    }


    var password = function () {
        if (defaultLogin) {
            return '123456';
        } else {
            return '';
        }
    }

    var userRole = function () {
        return sessionStorage.getItem('userRole');
    }

    var userId = function () {
        return sessionStorage.getItem('userId');
    }

    var firstName = function () {
        return sessionStorage.getItem('firstName');
    }

    var lastName = function () {
        return sessionStorage.getItem('lastName');
    }

    var email = function () {
        return sessionStorage.getItem('email');
    }

    var departmentName = function () {
        return sessionStorage.getItem('departmentName');
    }

    var departmentId = function () {
        return sessionStorage.getItem('departmentId')/1;    //convert departmentId to a number
    }

    var token = function () {
        return sessionStorage.getItem('token');
    }

    var isAdmin = function () {
        if (useRoles) {
            if (sessionStorage.getItem('userRole') == null)
                return false;

            return sessionStorage.getItem('userRole').toString().toLowerCase() == "admin";
        } else {
            return true;
        }
    }

    var isGeneral = function () {
        if (useRoles) {
            if (sessionStorage.getItem('userRole') == null)
                return false;

            return sessionStorage.getItem('userRole').toString().toLowerCase() == "general";
        } else {
            return true;
        }
    }


    var isPasswordReset = function () {
        if (useRoles) {
            if (sessionStorage.getItem('userRole') == null)
                return false;

            return sessionStorage.getItem('userRole').toString().toLowerCase() == "password";
        } else {
            return true;
        }
    }

    var isLoggedIn = function () {
        if (sessionStorage.getItem('token') == null)
            return false;

        return sessionStorage.getItem('token').length > 0;
    }

    return {
        AuthInit: AuthInit,

        roleGeneral: 'general',
        roleAdmin: 'admin',
        rolePasswordReset: 'password',

        processLogin: processLogin,
        processLogout: processLogout,
        getUsersTypes: getUsersTypes,

        userName: userName,
        password: password,
        userRole: userRole,
        userId: userId,
        firstName: firstName,
        lastName: lastName,
        email: email,
        departmentName: departmentName,
        departmentId: departmentId,
        token: token,

        isAdmin: isAdmin,
        isGeneral: isGeneral,
        isPasswordReset: isPasswordReset,

        isLoggedIn: isLoggedIn,
        eventLoginSuccess: eventLoginSuccess,
        eventLoginFail: eventLoginFail,
        eventLogoutSuccess: eventLogoutSuccess,
        eventLogoutSuccess: eventLogoutSuccess,
    }
}]);

//inject the token onto all http requests
angular.module('InventoryApp').factory('AuthFactory', ['$q', '$window', function ($q, $window) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.getItem('token')) {
                config.headers.Authorization = 'Bearer ' + $window.sessionStorage.getItem('token');
            }
            return config || $q.when(config);
        }
    };
}]);