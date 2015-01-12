using inventory_control.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace inventory_control.Adapters
{
    public interface ILocationAdapter
    {
        LocationsVM GetLocations();

        LocationItemsVM GetLocationItemsByLocationId(int locationId);

        LocationItemsVM GetLocationItemsByItemId(int itemId);

        LocationsVM GetLocation(int locationId);

        LocationItemVM RemoveLocationItemXref(LocationItemsVM model);

        LocationItemsVM SaveLocationItemXrefForLocation(LocationItemsVM model);

        LocationItemsVM SaveLocationItemXrefForItem(LocationItemsVM model);
    }
}
