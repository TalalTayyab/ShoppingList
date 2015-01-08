/// <reference path="../angular.js" />


(function () {

   
    var app = angular.module("shoppingListApp", []);

    //constants
    app.constant('editItemLiteral', "Edit item");
    app.constant('addItemLiteral', "Add item");

    //directives
    app.directive('showDialog', function () {
        return function (scope, element, attrs) {
            scope.$on("showDialogUpdated", function (event, args) {

                $(element[0]).modal(args ? 'show' : 'hide');
                
            });

        };
    });


    //filter
    app.filter("completedItems", function () {
        return function (items, showCompleted) {
            var result = [];
            angular.forEach(items, function (item) {
                if (showCompleted || !item.completed) {
                    result.push(item);
                };
            });
            return result;
        };
    });

    
    //mainCtrl
    app.controller('mainCtrl', ['$scope', '$rootScope', 'shoppingDataHandler', 'editItemLiteral', 'addItemLiteral',
        function ($scope, $rootScope, shoppingDataHandler,editItemLiteral,addItemLiteral) {
        
        $scope.items = [];
        $scope.editableItem = null;
        $scope.showCompleted = false;
        $scope.filterText = '';

        $scope.defaultItem = {
            id: -1,
            name: '',
            completed: false,
            quantity:1
        };
        
        initEditableItem = function(){
            $scope.editableItem = angular.copy($scope.defaultItem);
        };

        initEditableItem();

        shoppingDataHandler.getAll(function (data) {
            $scope.items = data;
        });

    

        $scope.saveItem = function (item) {
            shoppingDataHandler.save(item, function (data) {


                if (item.id == -1) {
                    $scope.items.push(data);
                } else {

                    for (i = 0; i < $scope.items.length; i++) {
                        if ($scope.items[i].id === item.id) {
                            $scope.items[i] = angular.copy(item);
                            break;
                        };
                    };
                };

                $scope.hideDialog();
            });
        };

        $scope.removeItem = function (item) {
            shoppingDataHandler.remove(item.id, function () {
                var index = $scope.items.indexOf(item);
                if (index > -1) {
                    $scope.items.splice(index, 1);
                };
            });
        }

        $scope.displayDialog = function (item) {
            $scope.editableItem = angular.copy(item);
            $scope.$broadcast("showDialogUpdated", true);
           
        };

        $scope.hideDialog = function () {
            initEditableItem();
            $scope.$broadcast("showDialogUpdated", false);
        }

       

        $scope.cancel = function () {
            $scope.hideDialog();
        };

        $scope.getDialogTitle = function () {
            return $scope.editableItem != null && $scope.editableItem.id != -1 ? editItemLiteral : addItemLiteral;
        };



    }]);

    
  

}());