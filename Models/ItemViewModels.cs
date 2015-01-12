using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace inventory_control.Models
{
    public class ItemVM
    {
        public int ItemId { get; set; }
        public string ItemName { get; set; }
        public string Description { get; set; }
        public string BarCode { get; set; }
        public int MaxQuantity { get; set; }
        public int MinQuantity { get; set; }
        public int QuantityInStock { get; set; }
        public int QuantityPerPallet { get; set; }
        public bool IsDeleted { get; set; }
        public string SupplierName { get; set; }
        public string SupplierPartName { get; set; }
    }
    public class ItemsVM
    {
        public SuppliersVM Suppliers { get; set; }
        public SupplierPartsVM SupplierParts { get; set; }
        public List<ItemVM> Items { get; set; }
    }
}