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
    [RoutePrefix("location")]
    public class LocationController : ApiController
    {
        private ILocationAdapter _adapter;

        public LocationController()
        {
            _adapter = new LocationDataAdapter();
        }

        //GET: location/locitemsbylocation/{locationId}
        [Route("locitemsbylocation/{locationId}")]
        [Authorize(Roles = Role.ADMIN)]
        public IHttpActionResult GetLocationItemsByLocationId(int locationId)
        {
            LocationItemsVM model = _adapter.GetLocationItemsByLocationId(locationId);
            model.LocationId = locationId;

            return Ok(model);
        }


        //GET: location/locitemsbyitem/{locationId}
        [Route("locitemsbyitem/{itemId}")]
        [Authorize(Roles = Role.ADMIN)]
        public IHttpActionResult GetLocationItemsByItemId(int itemId)
        {
            LocationItemsVM model = _adapter.GetLocationItemsByItemId(itemId);
            model.ItemId = itemId;


            return Ok(model);
        }

        //GET: location/locations
        [Route("locations")]
        [Authorize(Roles = Role.ADMIN)]
        public IHttpActionResult GetLocations()
        {
            LocationsVM model = _adapter.GetLocations();

            return Ok(model);
        }

        //GET: location/{locationId}
        [Authorize(Roles = Role.ADMIN)]
        [Route("{locationId}")]
        public IHttpActionResult GetLocation(int locationId)
        {
            LocationsVM model = _adapter.GetLocation(locationId);

            return Ok(model);
        }


        //GET: location/save/locations
        [Route("save/loctiemsforitem")]
        [Authorize(Roles = Role.ADMIN)]
        public IHttpActionResult SaveLocationItemsForItem(LocationItemsVM model)
        {
            
            model = _adapter.SaveLocationItemXrefForItem(model);

            return Ok(model);
        }


        //GET: location/save/locationitems
        [Route("save/loctiemsforlocation")]
        [Authorize(Roles = Role.ADMIN)]
        public IHttpActionResult SaveLocationItemsForLocation(LocationItemsVM model)
        {

            model = _adapter.SaveLocationItemXrefForLocation(model);

            return Ok(model);
        }


        //GET: location/removelocationitems
        [Route("removelocationitems")]
        [Authorize(Roles = Role.ADMIN)]
        public IHttpActionResult removeLocationItem(LocationItemsVM model)
        {
            _adapter.RemoveLocationItemXref(model);

            return Ok(model);
        }
    }
}
