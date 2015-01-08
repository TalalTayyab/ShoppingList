(function () {


    var app = angular.module('shoppingListApp');

    //error handler
    app.factory('errorHandler', function () {

        var errors = [];
        var lastError = null;

        function formatErrorMessage(err, status) {
            var msg = "";
            msg = status != null ? "Status: " + status + " " : "";
            msg += err.ExceptionMessage != null ? err.ExceptionMessage : (err.Message != null ? err.Message : (err.message != null ? err.message : err));
            return msg;
        };

        return {
            addError: function (err, status) {
                lastError = formatErrorMessage(err);
                errors.push(lastError);
            },
            getLastError: function () {
                return lastError;
            },
            clearLastError: function () {
                lastError = null;
            },
            getAllErrors: function () {
                return errors;
            }
        };
    });

}());