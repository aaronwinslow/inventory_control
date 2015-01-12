using inventory_control.Models;
using inventory_control.Data;
using inventory_control.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace inventory_control.Adapters.Data
{
    public class UserDataAdapter : IUserAdapter
    {
        public UsersVM GetUsers()
        {
            UsersVM model = new UsersVM();

            using (ApplicationDbContext db = new ApplicationDbContext())
            {
                model.Users = db.Users.Select(u => new UserVM
                {
                    UserId = u.Id,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    DepartmentName = u.Department.DepartmentName,
                    DepartmentId = u.Department.DepartmentId,
                    Email = u.Email,
                    UserName = u.UserName

                }).ToList();
            }
            return model;
        }

        public UsersVM GetUser(string userId)
        {
            UsersVM model = new UsersVM();

            using (ApplicationDbContext db = new ApplicationDbContext())
            {
                model.Users = db.Users.Where(u => u.Id == userId).Select(u => new UserVM
                {
                    UserId = u.Id,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    DepartmentName = u.Department.DepartmentName,
                    DepartmentId = u.Department.DepartmentId,
                    Email = u.Email,
                    UserName = u.UserName

                }).ToList();

                LookupDataAdapter lookups = new LookupDataAdapter();
                model.Departments = lookups.GetDepartments();

            }
            return model;
        }


        public UsersVM SaveUser(UserVM model, string pass)
        {

            UsersVM users = new UsersVM();

            using (ApplicationDbContext db = new ApplicationDbContext())
            {
                UserManager<ApplicationUser> userManager =
                    new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(db));
                RoleManager<Role> roleManager =
                    new RoleManager<Role>(new RoleStore<Role>(db));

                ApplicationUser dbUser = db.Users.FirstOrDefault(u => u.Id == model.UserId);
                ApplicationUser user = userManager.FindById(model.UserId);

                bool isNewUser = false;

                if (user == null)
                {
                    isNewUser = true;
                    userManager.Create(new ApplicationUser
                    {
                        Email = model.Email,
                        UserName = model.UserName,
                        FirstName = model.FirstName,
                        LastName = model.LastName,
                        DepartmentId = model.DepartmentId
                    }, pass);
                    
                }
                else if (model.IsSetPassword && user != null)
                {
                    string hashedPasword = userManager.PasswordHasher.HashPassword(pass);
                    user.PasswordHash = hashedPasword;
                }
                else if (model.IsUserChangePassword && user != null)
                {
                    string hashedPasword = userManager.PasswordHasher.HashPassword(model.NewPassword);
                    user.PasswordHash = hashedPasword;
                }
                else 
                {
                    user.Email = model.Email;
                    user.UserName = model.UserName;
                    user.FirstName = model.FirstName;
                    user.LastName = model.LastName;
                    user.DepartmentId = model.DepartmentId;
                }

                db.SaveChanges();
                user = userManager.FindByName(model.UserName);

                if (isNewUser || model.IsSetPassword)
                {
                    if (user != null)
                    {
                        var roles = userManager.GetRoles(user.Id).ToArray();
                        userManager.RemoveFromRoles(user.Id, roles);
                    }
                    
                    userManager.AddToRole(user.Id, Role.PASSWORD);

                    db.SaveChanges();

                }
                else if (model.IsUserChangePassword)
                {
                    if (userManager.IsInRole(user.Id, Role.PASSWORD))
                    {
                        userManager.RemoveFromRoles(user.Id, userManager.GetRoles(user.Id).ToArray());

                        userManager.AddToRole(user.Id, Role.GENERAL);
                    }

                    db.SaveChanges();
                }

                users = GetUser(user.Id);
            }
            return users;

        }


        public DepartmentsVM GetDepartments()
        {
            LookupDataAdapter lookups = new LookupDataAdapter();
            return lookups.GetDepartments();
        }


        public void ValidateUser(UserVM model)
        {
            using (ApplicationDbContext db = new ApplicationDbContext())
            {
                UserManager<ApplicationUser> userManager =
                    new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(db));
                RoleManager<Role> roleManager =
                    new RoleManager<Role>(new RoleStore<Role>(db));

                ApplicationUser userByUserId = db.Users.Where(u => u.Id == model.UserId).FirstOrDefault();
                ApplicationUser userByEmail = db.Users.Where(u => u.Email == model.Email).FirstOrDefault();
                ApplicationUser userByUserName = db.Users.Where(u => u.UserName == model.UserName).FirstOrDefault();

                model.UserName = ("" + model.UserName).Trim();
                model.Email = ("" + model.Email).Trim();
                model.DepartmentId = model.DepartmentId;
                model.FirstName = ("" + model.FirstName).Trim();
                model.LastName = ("" + model.LastName).Trim();
                model.LastName = ("" + model.LastName).Trim();

                model.DepartmentId_Err = "";
                model.Email_Err = "";
                model.FirstName_Err = "";
                model.IsExistingEmail = false;
                model.IsExistingUserNameErr = false;
                model.IsUserSaveError = false;
                model.LastName_Err = "";
                model.UserName_Err = "";

                //check user name
                if (model.UserName.Length < 6)
                {
                    model.IsUserSaveError = true;
                    model.UserName_Err = "Enter a username.";
                }

                if (userByUserName != null)
                {
                    if (userByUserName.UserName == model.UserName && userByUserName.Id != model.UserId)
                    {
                        model.IsExistingUserNameErr = true;
                        model.IsUserSaveError = true;
                    }
                }

                //check email
                if (model.Email.Length < 6)
                {
                    model.IsUserSaveError = true;
                    model.Email_Err = "Enter an email.";
                }

                if (userByEmail != null)
                {
                    if (userByEmail.Email == model.Email && userByEmail.Id != model.UserId)
                    {
                        model.IsExistingEmail = true;
                        model.IsUserSaveError = true;
                    }
                }

                //check name
                if (model.FirstName.Length < 1)
                {
                    model.IsUserSaveError = true;
                    model.FirstName_Err = "Enter a first name.";
                }
                if (model.LastName.Length < 1)
                {
                    model.IsUserSaveError = true;
                    model.LastName_Err = "Enter a last name.";
                }

                //check dept
                if (model.DepartmentId < 1)
                {
                    model.IsUserSaveError = true;
                    model.DepartmentId_Err = "Select a department.";
                }
            }
        }
    }
}