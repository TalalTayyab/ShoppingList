using ShoppingList.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ShoppingList.Controllers
{
    public class ShoppingController : ApiController
    {
        ShoppingRepository _repository = null;

        ShoppingRepository Repository
        {
            get { return _repository; }
            set { _repository = value; }
        }

        public ShoppingController()
        {
            Repository = new ShoppingRepository();
        }
        // GET api/values
        public IEnumerable<ShoppingItem> Get()
        {
            return Repository.Select(x => { return true; });
        }

        // GET api/values/5
        public ShoppingItem Get(int id)
        {
            return Repository.Select(x => x.id == id).FirstOrDefault();
        }

        // POST api/values
        public HttpResponseMessage Post(ShoppingItem item)
        {
            item = Repository.Save(item);

            HttpResponseMessage response = Request.CreateResponse<ShoppingItem>(HttpStatusCode.Created, item);

            return response;

        }

        // PUT api/values
        public void Put(ShoppingItem item)
        {
            Repository.Save(item);
        }

        // DELETE api/values/5
        public void Delete(int id)
        {
            Repository.Delete(id);
        }
    }
}
