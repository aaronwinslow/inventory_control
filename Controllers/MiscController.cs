using inventory_control.Adapters;
using inventory_control.Adapters.Data;
using inventory_control.Controllers;
using inventory_control.Data;
using inventory_control.Data.Models;
using inventory_control.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace inventory_control.Controllers
{
     [RoutePrefix("misc")]
    public class MiscController : ApiController
    {
        //GET: misc/usertypes
        [Route("usertypes")]
        [Authorize(Roles = Role.ADMIN)]
        public string UserTypes()
        {
            Seeder.Seed();

            return "Seeder Complete";
        }
    }
}
