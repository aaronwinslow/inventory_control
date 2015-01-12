using inventory_control.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace inventory_control.Adapters
{
    public interface IOrderAdapter
    {
        OrdersVM GetOrders();

        OrdersVM GetOrder(int orderId);

        void CreateOrder(OrderVM order);

        OrdersVM GetOrderByUser(string userId);

        void UpdateOrder(OrderVM order);
    }
}
