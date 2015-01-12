using inventory_control.Adapters;
using inventory_control.Adapters.Data;
using inventory_control.Data.Models;
using inventory_control.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace inventory_control.Controllers
{
    [RoutePrefix("item")]
    public class ItemController : ApiController
    {
        private IItemAdapter _adapter;

        public ItemController()
        {
            _adapter = new ItemDataAdapter();
        }

        //GET: item/all
        [Route("all")]
        [Authorize(Roles = Role.ADMIN_GENERAL)]
        public IHttpActionResult GetItems()
        {

           ItemsVM model = _adapter.GetItems();

            return Ok(model);
        }

        //GET: item/{itemId}
        [Route("{itemId}")]
        [Authorize(Roles = Role.ADMIN_GENERAL)]
        public IHttpActionResult GetItem(int itemId)
        {

            ItemsVM model = _adapter.GetItem(itemId);

            return Ok(model);
        }

        //GET: item/threshold
        [Route("threshold")]
        public string GetThreshhold()
        {

            ItemProcessing.ProcessThresholdQuantities();
             
            return "Threshold Check Complete";
        }
    }
}
