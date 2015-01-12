using inventory_control.Models;
using inventory_control.Data;
using inventory_control.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace inventory_control.Adapters.Data
{
    public class ItemDataAdapter : IItemAdapter
    {
        public ItemsVM GetItem(int itemId)
        {
            ItemsVM model = new ItemsVM();

            using (ApplicationDbContext db = new ApplicationDbContext())
            {
                model.Items = db.Items.Where(i => i.ItemId == itemId).Select(i => new ItemVM
                {
                    ItemId = i.ItemId,
                    ItemName = i.ItemName,
                    Description = i.Description,
                    BarCode = i.BarCode,
                    MaxQuantity = i.MaxQuantity,
                    MinQuantity = i.MinQuantity,
                    QuantityInStock = i.QuantityInStock,
                    QuantityPerPallet = i.QuantityPerPallet,
                    SupplierName = i.Supplier.SupplierName,
                    SupplierPartName = i.SupplierPart.SupplierPartName                    
                }).ToList();

                LookupDataAdapter lookups = new LookupDataAdapter();
                model.Suppliers = lookups.GetSuppliers();
                model.SupplierParts = lookups.GetSupplierParts();
            }
            return model;
        }

        public ItemsVM GetItems()
        {
            ItemsVM model = new ItemsVM();

            using (ApplicationDbContext db = new ApplicationDbContext())
            {
                model.Items = db.Items.Select(i => new ItemVM
                {
                    ItemId = i.ItemId,
                    ItemName = i.ItemName,
                    Description = i.Description,
                    BarCode = i.BarCode,
                    MaxQuantity = i.MaxQuantity,
                    MinQuantity = i.MinQuantity,
                    QuantityInStock = i.QuantityInStock,
                    QuantityPerPallet = i.QuantityPerPallet,
                    SupplierName = i.Supplier.SupplierName,
                    SupplierPartName = i.SupplierPart.SupplierPartName 
                }).ToList();
            }
            return model;
        }
    }
}