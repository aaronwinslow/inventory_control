using inventory_control.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace inventory_control.Adapters
{
    public interface IItemAdapter
    {
        ItemsVM GetItems();
        ItemsVM GetItem(int itemId);

    }
}
