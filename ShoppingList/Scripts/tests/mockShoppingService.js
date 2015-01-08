var mockservice = (function () {

    var mockShoppingService = {

        getAll: function (succ) {

            items = [
                { id: 1, name: 'Milk', quantity: 1, completed: false },
                { id: 2, name: 'Eggs', quantity: 12, completed: true }
            ];

            succ(items);

        },
        save: function (item, succ) {

            if (item.id == -1) {

                item.id = 3;
                items.push(item);


            } else {

                for (i = 0; i < items.length; i++) {
                    if (items[i].id === item.id) {
                        items[i] = angular.copy(item);
                        break;
                    };
                };

            };

            succ(item);


        },
        remove: function (id, succ) {
            var item = null;
            for (i = 0; i < items.length; i++) {
                if (items[i].id === id) {
                    item = items[i];
                    break;
                };
            };
            if (item !== null) {
                var index = items.indexOf(item);
                if (index > -1) {
                    items.splice(index, 1);
                };
            }
        }

    };

    return {
        shoppingService: mockShoppingService
    };
}());

