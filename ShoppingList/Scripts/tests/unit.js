/// <reference path="angular.js" />
/// <reference path="angular-mocks.js" />
/// <reference path="jasmine/jasmine.js" />
/// <reference path="mockservice.js" />




describe("Shopping list", function () {

    //Load the module
    beforeEach(angular.mock.module("shoppingListApp"));

    
    describe("data hanlder service", function () {

        var service = null;
        var backend = null;
        var http = null;

        var url = "/api/shopping"


        beforeEach(angular.mock.inject(function ($httpBackend, $http) {
            backend = $httpBackend;
            http = $http;

        }));

        beforeEach(angular.mock.inject(function (shoppingDataHandler) {
            service = shoppingDataHandler;
        }));

        it("get list", function () {
            service.getAll(function (data) {
                expect(data.length).toBe(2);
                var item = data[0];
                expect(item.id).toBe(1);
                expect(item.name).toBe("Eggs");
                expect(item.quantity).toBe(12);
                expect(item.completed).toBe(false);
            });

            backend.expect("GET", url).respond(
             [
                 { id: 1, name: 'Eggs', quantity: 12, completed: false },
                 { id: 2, name: 'Bread', quantity: 1, completed: true }
             ]);

            backend.flush();
        });

        it("save milk with id 1", function () {
            var item = { id: -1, name: 'Milk', quantity: 1, completed: false };
            service.save(item, function (data) {
                expect(data.id).toBe(1);
            });


            backend.expect("POST", url, { id: -1, name: 'Milk', quantity: 1, completed: false }).respond(
                {
                    id: 1,
                    name: 'Milk',
                    quantity: 1,
                    completed: false
                });

            backend.flush();
        })


        it("Milk bought", function () {
            var item = { id: 1, name: 'Milk', quantity: 1, completed: true };
            service.save(item, function (data) {

            });

            backend.expect("PUT", url, { id: 1, name: 'Milk', quantity: 1, completed: true }).respond({});
            backend.flush();
        })

        it('Eggs (id of 2) deleted', function () {
            service.remove(2, function (data) {

            });

            backend.expect("DELETE", url + '/2').respond({});
            backend.flush();
        });

    });


    describe("error handler service", function () {

        var service = null;

        beforeEach(angular.mock.inject(function (errorHandler) {
            service = errorHandler;
        }));

        it("Adds one string error", function () {
            service.addError("This is a test error");
            expect(service.getAllErrors().length).toBe(1);
            expect(service.getLastError()).toBe("This is a test error");
        });

        it("clears the last error", function () {
            service.addError("some error");
            service.clearLastError();
            expect(service.getLastError()).toBe(null);
        });

        it("Adds one exception", function () {
            try {
                throw { name: 'CustomException', message: 'Custom Exception occured' };
            }
            catch (e) {
                service.addError(e);
            }

            expect(service.getAllErrors().length).toBe(1);
            expect(service.getLastError()).toBe('Custom Exception occured');
        });

        it('Adds two errors', function () {
            service.addError("This is a test error 1 ");
            service.addError("This is a test error 2");

            expect(service.getAllErrors().length).toBe(2);
            expect(service.getLastError()).toBe("This is a test error 2");
        });

    });


    describe("mainCtrl test", function () {
        var scope = {};
        var controller = null;
        var mockShoppingService = mockservice.shoppingService;
        var errorService = null;
        var backend = null;
        var http = null;
        var rootScope = null;
        var constantEditItem ;
        var constantAddItem;

        beforeEach(angular.mock.inject(function ($httpBackend, $http, $controller, $rootScope, errorHandler, editItemLiteral,addItemLiteral) {
            backend = $httpBackend;
            http = $http;
            errorHandler = errorService;
            scope = $rootScope.$new();
            rootScope = $rootScope;
            spyOn($rootScope, '$broadcast');
            constantEditItem = editItemLiteral;
            constantAddItem = addItemLiteral;

            var items = [];
           

            controller = $controller("mainCtrl", {
                $scope: scope,
                $rootScope: $rootScope,
                shoppingDataHandler: mockShoppingService
            });


        }));



        it("Has editable item initialized", function () {
            expect(scope.editableItem).toBeDefined();
            expect(scope.editableItem.id).toBe(-1);
            expect(scope.editableItem.name).toBe("");
            expect(scope.editableItem.completed).toBe(false);
            expect(scope.editableItem.quantity).toBe(1);

        });

        it("Has two items", function () {

            expect(scope.items.length).toBe(2);
            var item = scope.items[0];
            expect(item.id).toBe(1);
            expect(item.name).toBe("Milk");
            expect(item.quantity).toBe(1);
            expect(item.completed).toBe(false);
        });



        it("save new bread item", function () {
            var item = { id: -1, name: 'Bread', quantity: 1, completed: false };
            scope.saveItem(item);


            expect(scope.items.length).toBe(3);
            var item = scope.items[2];
            expect(item.id).toBe(3);
            expect(item.name).toBe("Bread");
            expect(item.quantity).toBe(1);
            expect(item.completed).toBe(false);

            expect(rootScope.$broadcast).toHaveBeenCalledWith('showDialogUpdated',false);
        });

        it("delete milk", function () {
            scope.removeItem(scope.items[0]);
            expect(scope.items.length).toBe(1);
        });

        it('display dialog to edit item', function () {
            scope.displayDialog(scope.items[0]);

            expect(scope.editableItem.id).toBe(scope.items[0].id);
            expect(rootScope.$broadcast).toHaveBeenCalledWith('showDialogUpdated', true);
            expect(scope.getDialogTitle()).toBe(constantEditItem);
        });

        it('hide dialog and clear editable item', function () {
            scope.hideDialog();

            expect(scope.editableItem.id).toBe(-1);
            expect(rootScope.$broadcast).toHaveBeenCalledWith('showDialogUpdated', false);
            expect(scope.getDialogTitle()).toBe(constantAddItem);
        })

        it('cancel the edit operation', function () {
            scope.cancel();
            expect(scope.editableItem.id).toBe(-1);
            expect(rootScope.$broadcast).toHaveBeenCalledWith('showDialogUpdated', false);
        });
    });



    describe('showDialog directive test', function () {
        
        var rootScope = null;
        var compileService = null;
        var scope = null;

        beforeEach(angular.mock.inject(function ($rootScope, $compile) {
            rootScope = $rootScope;
            scope = rootScope.$new();
            compileService = $compile;
        }));

        //it('displays bootstrap dialog', function () {
        //    var compileFn = compileService("<div class='modal'   show-dialog>");
        //    var ele = compileFn(scope);
        //    scope.$broadcast("showDialogUpdated", true);
           
           
        //    expect(ele.css("display")).toBe("block");
        //});

    }); 



    describe('testing completedItems filter', function () {

        var filterInstance = null;
        var items = null;

        beforeEach(angular.mock.inject(function ($filter) {
            filterInstance = $filter("completedItems");
            items = [
                    { id: 1, name: 'Eggs', quantity: 12, completed: true },
                    { id: 2, name: 'Milk', quantity: 1, completed: false },
                    { id: 3, name: 'Bread', quantity: 1, completed: true },
                    { id: 4, name: 'Butter', quantity: 2, completed: false }
            ];

        }));


        it('returns not completed items', function () {
            var result = filterInstance(items, false);
            expect(result.length).toBe(2);
            expect(result[0].id).toBe(2);
        });


        it('returns all items', function () {
            var result = filterInstance(items, true);
            expect(result.length).toBe(4);
            expect(result[0].id).toBe(1);
        });

    })

});
