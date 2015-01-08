using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ShoppingList.Models
{
    public class ShoppingItem
    {
        public int id { get; set; }

        public string name { get; set; }

        public int quantity { get; set; }

        public bool completed { get; set; }
    }
}