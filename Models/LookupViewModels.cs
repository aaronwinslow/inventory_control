using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace inventory_control.Models
{
    public class SupplierVM
    {
        public int SupplierId { get; set; }
        public string SupplierName { get; set; }
    }
    public class SuppliersVM
    {
        public List<SupplierVM> Suppliers { get; set; }
    }

    public class SupplierPartVM
    {
        public int SupplierPartId { get; set; }
        public string SupplierPartName { get; set; }

    }

    public class SupplierPartsVM
    {
        public List<SupplierPartVM> SupplierParts { get; set; }
    }


    public class DepartmentVM
    {
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; }
    }

    public class DepartmentsVM
    {
        public List<DepartmentVM> Departments { get; set; }
    }

}