using inventory_control.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace inventory_control.Adapters
{
    public interface IUserAdapter
    {
        UsersVM GetUsers();
        UsersVM GetUser(string userId);

        DepartmentsVM GetDepartments();

        UsersVM SaveUser(UserVM model, string pass);

        void ValidateUser(UserVM model);
    }
}
