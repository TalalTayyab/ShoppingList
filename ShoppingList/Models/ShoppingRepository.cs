using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ShoppingList.Models
{
    public class ShoppingRepository 
    {
        public IEnumerable<ShoppingItem> Select(Func<ShoppingItem,bool> clause)
        {
            return ShoppingDataStore.ShoppingItems.Where(clause);
        }

        public void Delete(int id)
        {
            var item = Select(e => e.id == id).FirstOrDefault();
            if (item != null)
            {
                ShoppingDataStore.ShoppingItems.Remove(item);
            }
        }

        public ShoppingItem Save(ShoppingItem item)
        {
            var foundItem = Select(e => e.id == item.id).FirstOrDefault();
            if (foundItem == null)
            {
                item.id = ShoppingDataStore.ShoppingItems.Max(e => e.id) + 1;
                ShoppingDataStore.ShoppingItems.Add(item);
                foundItem = item;
            }
            else
            {
                foundItem.id = item.id;
                foundItem.name = item.name;
                foundItem.completed = item.completed;
                foundItem.quantity = item.quantity;
            }

            return foundItem;
        }

        
    }
}