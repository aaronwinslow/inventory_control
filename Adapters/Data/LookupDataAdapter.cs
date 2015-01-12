using inventory_control.Models;
using inventory_control.Data;
using inventory_control.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace inventory_control.Adapters.Data
{
    public class LookupDataAdapter
    {
        public DepartmentsVM GetDepartments()
        {
            DepartmentsVM model = new DepartmentsVM();
            using (ApplicationDbContext db = new ApplicationDbContext())
            {
                model.Departments = db.Departments.Select(d => new DepartmentVM
                {
                    DepartmentId = d.DepartmentId,
                    DepartmentName = d.DepartmentName
                    
                }).ToList();
            }
            return model;
        }

        public SuppliersVM GetSuppliers()
        {
            SuppliersVM model = new SuppliersVM();
            using (ApplicationDbContext db = new ApplicationDbContext())
            {
                model.Suppliers = db.Suppliers.Select(s => new SupplierVM
                {
                    SupplierId = s.SupplierId,
                    SupplierName = s.SupplierName
                    

                }).ToList();
            }
            return model;
        }

        public SupplierPartsVM GetSupplierParts()
        {
            SupplierPartsVM model = new SupplierPartsVM();
            using (ApplicationDbContext db = new ApplicationDbContext())
            {
                model.SupplierParts = db.SupplierParts.Select(s => new SupplierPartVM
                {
                    SupplierPartId = s.SupplierPartId,
                    SupplierPartName = s.SupplierPartName
                    

                }).ToList();
            }
            return model;
        }
    }
}