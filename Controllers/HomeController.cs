using inventory_control.Data;
using inventory_control.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace inventory_control.Controllers
{
    [RoutePrefix("home")]
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = "Home Page";

            Redirect("/app/index.html");

            return View();
        }
    }
}
