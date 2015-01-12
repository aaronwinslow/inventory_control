using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace inventory_control.Models
{
    public class LocationVM
    {
        public int LocationId { get; set; }
        public string LocationName { get; set; }
        public int PalletCapacity { get; set; }
        public int PalletsRemaining { get; set; }

        public LocationItemsVM LocationItems { get; set; }
        public ItemsVM Items { get; set; }
    }
    public class LocationsVM
    {
        public List<LocationVM> Locations { get; set; }
    }

    public class LocationItemVM
    {
        public int ItemLocationXrefId { get; set; }
        public int ItemId { get; set; }
        public string ItemName { get; set; }
        public int LocationId { get; set; }
        public string LocationName { get; set; }
        public int QuantityOnPallet { get; set; }
        public int QuantityPerPallet { get; set; }

        //used for action flags
        public bool IsDeleted { get; set; }
        public bool IsNew { get; set; }
    }

    public class LocationItemsVM
    {
        public List<LocationItemVM> LocationItems { get; set; }

        public int LocationId { get; set; }
        public int ItemId { get; set; }
    }
}