using inventory_control.Models;
using inventory_control.Data;
using inventory_control.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace inventory_control.Adapters.Data
{
    public class OrderDataAdapter : IOrderAdapter
    {
        public OrdersVM GetOrders()
        {
            OrdersVM model = new OrdersVM();
            model.Orders = new List<OrderVM>();
            using (ApplicationDbContext db = new ApplicationDbContext())
            {
                model.Orders = db.Orders.Select(o => new OrderVM
                    {
                        OrderId = o.OrderId,
                        ItemId = o.ItemId,
                        ItemName = o.Item.ItemName,
                        UserId = o.UserId,
                        FirstName = o.ApplicationUser.FirstName,
                        LastName = o.ApplicationUser.LastName,
                        DepartmentId = o.DepartmentId,
                        DepartmentName = o.Department.DepartmentName,
                        OrderQuantity = o.OrderQuantity,
                        UserDeleted = o.UserDeleted,
                        DeniedReason = o.DeniedReason,
                        BeginTimestamp = o.BeginTimestamp,
                        EndTimestamp = o.CompleteTimestamp,
                        AdminConfirmedDelete = o.AdminConfirmDeleted,
                        IsApproved = o.IsApproved,
                        IsDenied = o.IsDenied,
                        IsComplete = o.IsComplete,
                        IsQtyModified = o.IsQtyModified,
                        OriginalQty = o.OriginalQty,
                        QuantityInStock = o.Item.QuantityInStock

                    }).ToList();

            }
            return model;
        }


        public OrdersVM GetOrder(int orderId)
        {
            OrdersVM model = new OrdersVM();
            model.Orders = new List<OrderVM>();
            using (ApplicationDbContext db = new ApplicationDbContext())
            {
                model.Orders = db.Orders.Where(o2 => o2.OrderId == orderId).Select(o => new OrderVM
                {
                    OrderId = o.OrderId,
                    ItemId = o.ItemId,
                    ItemName = o.Item.ItemName,
                    UserId = o.UserId,
                    FirstName = o.ApplicationUser.FirstName,
                    LastName = o.ApplicationUser.LastName,
                    DepartmentId = o.DepartmentId,
                    DepartmentName = o.Department.DepartmentName,
                    OrderQuantity = o.OrderQuantity,
                    BeginTimestamp = o.BeginTimestamp,
                    EndTimestamp = o.CompleteTimestamp,
                    AdminConfirmedDelete = o.AdminConfirmDeleted,
                    UserDeleted = o.UserDeleted,
                    DeniedReason = o.DeniedReason,
                    IsDenied = o.IsDenied,
                    IsApproved = o.IsApproved,
                    IsComplete = o.IsComplete,
                    IsQtyModified = o.IsQtyModified,
                    OriginalQty = o.OriginalQty,
                    QuantityInStock = o.Item.QuantityInStock

                }).ToList();

            }
            return model;
        }


 

        public OrdersVM GetOrderByUser(string userId)
        {
            OrdersVM model = new OrdersVM();
            model.Orders = new List<OrderVM>();
            using (ApplicationDbContext db = new ApplicationDbContext())
            {
                model.Orders = db.Orders.Where(o2 => o2.UserId == userId).Select(o => new OrderVM
                {
                    OrderId = o.OrderId,
                    ItemId = o.ItemId,
                    ItemName = o.Item.ItemName,
                    UserId = o.UserId,
                    FirstName = o.ApplicationUser.FirstName,
                    LastName = o.ApplicationUser.LastName,
                    DepartmentId = o.DepartmentId,
                    DepartmentName = o.Department.DepartmentName,
                    UserDeleted = o.UserDeleted,
                    DeniedReason = o.DeniedReason,
                    OrderQuantity = o.OrderQuantity,
                    BeginTimestamp = o.BeginTimestamp,
                    EndTimestamp = o.CompleteTimestamp,
                    AdminConfirmedDelete = o.AdminConfirmDeleted,
                    IsDenied = o.IsDenied,
                    IsApproved = o.IsApproved,
                    IsComplete = o.IsComplete,
                    IsQtyModified = o.IsQtyModified,
                    OriginalQty = o.OriginalQty,
                    QuantityInStock = o.Item.QuantityInStock

                }).ToList();

            }

            return model;
        }

        public void CreateOrder(OrderVM order)
        {
            using (ApplicationDbContext db = new ApplicationDbContext())
            {
                Order dbOrder = db.Orders.FirstOrDefault(o => o.OrderId == order.OrderId);

                dbOrder = new Order();

                dbOrder.ItemId = order.ItemId;
                dbOrder.UserId = order.UserId;
                dbOrder.DepartmentId = order.DepartmentId;
                dbOrder.OrderQuantity = order.OrderQuantity;
                dbOrder.BeginTimestamp = DateTime.Now;
                dbOrder.OriginalQty = order.OrderQuantity;

                db.Orders.Add(dbOrder);
                db.SaveChanges();

                order.OrderId = dbOrder.OrderId;
            }
        }


        public void UpdateOrder(OrderVM order)
        {
            using (ApplicationDbContext db = new ApplicationDbContext())
            {
                Order dbOrder = db.Orders.FirstOrDefault(o => o.OrderId == order.OrderId);

                if (dbOrder != null)
                {
                    dbOrder.IsComplete = order.IsComplete;
                    dbOrder.IsDenied = order.IsDenied;
                    dbOrder.IsApproved = order.IsApproved;
                    dbOrder.UserDeleted = order.UserDeleted;
                    dbOrder.OrderQuantity = order.OrderQuantity;
                    dbOrder.IsQtyModified = order.IsQtyModified;
                    dbOrder.OriginalQty = order.OriginalQty;
                    dbOrder.CompleteTimestamp = order.EndTimestamp;
                    dbOrder.DeniedReason = order.DeniedReason;
                    dbOrder.AdminConfirmDeleted = order.AdminConfirmedDelete;

                    if (order.EndTimestamp == DateTime.MinValue)
                    {
                        dbOrder.CompleteTimestamp = DateTime.Now;
                    }

                    db.SaveChanges();

                }
                else 
                {
                    throw new Exception("Order does not exist");
                }
            }
        }
    }
}