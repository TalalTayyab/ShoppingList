using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ShoppingList.Models
{
    public class ShoppingDataStore
    {
        static List<ShoppingItem> _shoppingItems = null;

        public static List<ShoppingItem> ShoppingItems
        {
            get 
            {
                if (_shoppingItems == null)
                    _shoppingItems = GetItems();

                return _shoppingItems;
            }
           
        }

        static List<ShoppingItem> GetItems()
        {
            List<ShoppingItem> items = new List<ShoppingItem>();

            items.Add(new ShoppingItem()
            {
                id = 1,
                name = "Juice Orange fresh",
                quantity = 2
            });

            items.Add(new ShoppingItem()
            {
                id=2,
                name="Pepsi Cans",
                quantity=10
            });

            items.Add(new ShoppingItem()
            {
                id=3,
                name="Onions pieces",
                quantity=4
            });

            return items;
        }
    }
}