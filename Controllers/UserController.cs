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

namespace inventory_control.app.controllers
{
    [RoutePrefix("user")]
    public class UserController : ApiController
    {
        private IUserAdapter _adapter;

        public UserController()
        {
            _adapter = new UserDataAdapter();
        }

        //GET: user/all
        [Route("all")]
        [Authorize(Roles = Role.ADMIN)]
        public IHttpActionResult GetUsers()
        {

            UsersVM model = _adapter.GetUsers();

            return Ok(model);
        }

        //GET: user/{id}
        [Route("{id}")]
        [Authorize(Roles = Role.ALL)]
        public IHttpActionResult GetUser(string id)
        {

            UsersVM model = _adapter.GetUser(id);

            return Ok(model);
        }

        //GET: user/departments
        [Route("departments")]
        public IHttpActionResult GetDepartments()
        {

            DepartmentsVM model = _adapter.GetDepartments();

            return Ok(model);
        }
        
        //POST: user/update
        [Route("update")]
        [Authorize(Roles = Role.ADMIN)]
        public IHttpActionResult SaveUser(UserVM model)
        {

            _adapter.ValidateUser(model);

            UsersVM users = new UsersVM();
            users.Users = new List<UserVM>();
            
            if (!model.IsUserSaveError)
            {
                if (model.IsSetPassword || model.UserId == "")
                {
                    var pass = KeyGenerator.GetUniqueKey(12);

                    users = _adapter.SaveUser(model, pass);

                    MailModel mail = new MailModel();
                    mail.From = "Admin@inventorycontrol.tk";
                    mail.To = model.Email;
                    mail.Subject = "Access to inventory orders for " + model.FirstName + " " + model.LastName + ".";
                    mail.Body = "Welcome " + model.FirstName + ".  You have been given access to the inventory order system for the " +  users.Users[0].DepartmentName + " department.  Your temporary password is " + pass;

                    Email.Send(mail);

                    model.IsSetPassword = false;

                } else if (model.IsUserChangePassword) {

                    users = _adapter.SaveUser(model, "");

                    MailModel mail = new MailModel();
                    mail.From = "Admin@inventorycontrol.tk";
                    mail.To = model.Email;
                    mail.Subject = "Access to inventory orders for " + model.FirstName + " " + model.LastName + ".";
                    mail.Body = "Welcome " + model.FirstName + ".  You have been given access to the inventory order system for the " + users.Users[0].DepartmentName + " department.  Your password has been reset";

                    Email.Send(mail);

                    model.IsUserChangePassword = false;
                    model.NewPassword = "";
                }
                else
                {
                    users = _adapter.SaveUser(model, "");
                }

            }
            else
            {
                users.Users.Add(model);
            }


            

            return Ok(users);
        }


        //POST: user/updatepassword
        [Route("updatepassword")]
        [Authorize(Roles = Role.PASSWORD)]
        public IHttpActionResult SaveUserPassword(UserVM model)
        {

            _adapter.ValidateUser(model);

            UsersVM users = new UsersVM();
            users.Users = new List<UserVM>();

            if (!model.IsUserSaveError)
            {
                if (model.IsUserChangePassword)
                {
                    users = _adapter.SaveUser(model, "");

                    MailModel mail = new MailModel();
                    mail.From = "Admin@inventorycontrol.tk";
                    mail.To = model.Email;
                    mail.Subject = "Access to inventory orders for " + model.FirstName + " " + model.LastName + ".";
                    mail.Body = "Welcome " + model.FirstName + ".  You have been given access to the inventory order system for the " + model.DepartmentName + " department.  Your password has been reset";

                    Email.Send(mail);

                    model.IsUserChangePassword = false;
                    model.NewPassword = "";
                }
            }
            else
            {
                users.Users.Add(model);
            }

            return Ok(users);
        }


    }


 
}

