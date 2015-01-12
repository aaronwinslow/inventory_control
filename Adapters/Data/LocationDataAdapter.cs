using inventory_control.Models;
using inventory_control.Data;
using inventory_control.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace inventory_control.Adapters.Data
{
    public class LocationDataAdapter : ILocationAdapter
    {
        public LocationsVM GetLocations()
        {
            LocationsVM model = new LocationsVM();

            using (ApplicationDbContext db = new ApplicationDbContext())
            {
                model.Locations = db.Locations.Select(l => new LocationVM
                {
                    LocationId = l.LocationId,
                    LocationName = l.LocationName,
                    PalletCapacity = l.PalletCapacity,
                    PalletsRemaining = l.PalletCapacity - l.ItemLocationXrefs.Count()
                }).ToList();
            }
            return model;


        }

        public LocationsVM GetLocation(int locationId)
        {
            LocationItemsVM locationItems = new LocationItemsVM();
            LocationsVM location = new LocationsVM();
            
            using (ApplicationDbContext db = new ApplicationDbContext())
            {


                location.Locations = db.Locations.Where(l2 => l2.LocationId == locationId).Select(l => new LocationVM
                {
                    LocationId = l.LocationId,
                    LocationName = l.LocationName,
                    PalletCapacity = l.PalletCapacity,
                    PalletsRemaining = l.PalletCapacity - l.ItemLocationXrefs.Count(),
                }).ToList();

                if (location.Locations.Count() > 0)
                {
                    location.Locations[0].LocationItems = GetLocationItemsByLocationId(locationId);

                    ItemDataAdapter itemAdapter = new ItemDataAdapter();

                    location.Locations[0].Items = itemAdapter.GetItems();
                    
                }
            }
            return location;
        }


        public LocationItemsVM GetLocationItemsByLocationId(int locationId)
        {
            LocationItemsVM model = new LocationItemsVM();

            using (ApplicationDbContext db = new ApplicationDbContext())
            {
                model.LocationItems = db.ItemLocationXrefs.Where(l => l.LocationId == locationId).Select(li => new LocationItemVM
                {
                    ItemLocationXrefId = li.ItemLocationXrefId,
                    ItemId = li.ItemId,
                    LocationId = li.LocationId,
                    LocationName = li.Location.LocationName,
                    ItemName = li.Item.ItemName,
                    QuantityOnPallet = li.QuantityOnPallet,
                    QuantityPerPallet = li.Item.QuantityPerPallet


                }).ToList();
            }

            return model;
        }


        public LocationItemsVM GetLocationItemsByItemId(int itemId)
        {
            LocationItemsVM model = new LocationItemsVM();

            using (ApplicationDbContext db = new ApplicationDbContext())
            {
                model.LocationItems = db.ItemLocationXrefs.Where(l => l.ItemId == itemId).Select(li => new LocationItemVM
                {
                    ItemLocationXrefId = li.ItemLocationXrefId,
                    ItemId = li.ItemId,
                    LocationId = li.LocationId,
                    LocationName = li.Location.LocationName,
                    ItemName = li.Item.ItemName,
                    QuantityOnPallet = li.QuantityOnPallet,
                    QuantityPerPallet = li.Item.QuantityPerPallet

                }).ToList();
            }

            return model;
        }


        public LocationItemVM RemoveLocationItemXref(LocationItemsVM model)
        {
            throw new NotImplementedException();
        }


        public LocationItemsVM SaveLocationItemXrefForLocation(LocationItemsVM model)
        {
            LocationItemsVM locItems = new LocationItemsVM();

            using (ApplicationDbContext db = new ApplicationDbContext())
            {
                foreach (var item in model.LocationItems)
                {
                    int itemId = item.ItemId;

                    if (item.IsNew)
                    {
                        ItemLocationXref dbXref = new ItemLocationXref();
                        dbXref.LocationId = item.LocationId;
                        dbXref.ItemId = item.ItemId;
                        dbXref.QuantityOnPallet = item.QuantityOnPallet;

                        db.ItemLocationXrefs.Add(dbXref);
                    }
                    else if (item.IsDeleted)
                    {
                        ItemLocationXref dbXref = db.ItemLocationXrefs.FirstOrDefault(l => l.ItemLocationXrefId == item.ItemLocationXrefId);
                        if (dbXref != null)
                        {
                            db.ItemLocationXrefs.Remove(dbXref);
                        }
                    }
                    else
                    {
                        ItemLocationXref dbXref = db.ItemLocationXrefs.FirstOrDefault(l => l.ItemLocationXrefId == item.ItemLocationXrefId);
                        if (dbXref != null)
                        {
                            dbXref.QuantityOnPallet = item.QuantityOnPallet;
                            dbXref.LocationId = item.LocationId;

                        }
                    }

                    db.SaveChanges();

                    ItemProcessing.UpdateItemTotalQuantity(itemId);
                }
            }

            locItems = GetLocationItemsByLocationId(model.LocationId);

            return locItems;
        }

        public LocationItemsVM SaveLocationItemXrefForItem(LocationItemsVM model)
        {
            LocationItemsVM locItems = new LocationItemsVM();

            using (ApplicationDbContext db = new ApplicationDbContext())
            {
                foreach (var item in model.LocationItems)
                {
                    int itemId = item.ItemId;

                    if (item.IsNew)
                    {
                        ItemLocationXref dbXref = new ItemLocationXref();
                        dbXref.LocationId = item.LocationId;
                        dbXref.ItemId = item.ItemId;
                        dbXref.QuantityOnPallet = item.QuantityOnPallet;

                        db.ItemLocationXrefs.Add(dbXref);
                    }
                    else if (item.IsDeleted)
                    {
                        ItemLocationXref dbXref = db.ItemLocationXrefs.FirstOrDefault(l => l.ItemLocationXrefId == item.ItemLocationXrefId);
                        if (dbXref != null)
                        {
                            db.ItemLocationXrefs.Remove(dbXref);
                        }
                    }
                    else
                    {
                        ItemLocationXref dbXref = db.ItemLocationXrefs.FirstOrDefault(l => l.ItemLocationXrefId == item.ItemLocationXrefId);
                        if (dbXref != null)
                        {
                            dbXref.QuantityOnPallet = item.QuantityOnPallet;
                            dbXref.LocationId = item.LocationId;
                        }
                    }

                    db.SaveChanges();

                    ItemProcessing.UpdateItemTotalQuantity(itemId);
                }
            }

            locItems = GetLocationItemsByItemId(model.ItemId);

            return locItems;
        }


    }
}