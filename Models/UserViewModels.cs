using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace inventory_control.Models
{
    public class UserVM
    {
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; }
        public string Email { get; set; }

        public bool IsUserSaveError { get; set; }
        public string UserName_Err { get; set; }
        public bool IsExistingUserNameErr { get; set; }

        public string FirstName_Err { get; set; }
        public string LastName_Err { get; set; }
        public string DepartmentId_Err { get; set; }

        public string Email_Err { get; set; }
        public bool IsExistingEmail { get; set; }

        public bool IsSetPassword { get; set; }
        public bool IsUserChangePassword { get; set; }
        public string NewPassword { get; set; }
    
    }
    public class UsersVM
    {
        public List<UserVM> Users { get; set; }
        public DepartmentsVM Departments { get; set; }
    }
}