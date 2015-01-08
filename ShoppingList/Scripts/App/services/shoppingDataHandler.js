(function () {

    var app = angular.module('shoppingListApp');

    //service
    app.factory('shoppingDataHandler', ['$http', 'errorHandler', function ($http, errorHandler) {

        var url = "/api/shopping";

        function serviceRequest(reqFunc, succ) {
            reqFunc().success(function (data) {
                succ(data);
            }).error(function (err, status) {
                errorHandler.addError(err, status);
                console.log(errorHandler.getLastError());
            });
        }



        return {
            getAll: function (succ) {

                serviceRequest(function () {
                    return $http.get(url);
                }, succ);


            },
            save: function (item, succ) {
                if (item.id == -1) {

                    serviceRequest(function () {
                        return $http.post(url, item);
                    }, succ);


                } else {


                    serviceRequest(function () {
                        return $http.put(url, item);
                    }, succ);
                };


            },
            remove: function (id, succ) {
                serviceRequest(function () {
                    return $http.delete(url + '/'+ id);
                }, succ);
            }
        };


    }]);

}());