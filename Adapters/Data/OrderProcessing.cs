using inventory_control.Data;
using inventory_control.Data.Models;
using inventory_control.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace inventory_control.Adapters.Data
{
    public class OrderProcessing
    {
        public OrderProcessing()
        {

        }

        public WorkOrderVM ProcessOrderApproval(OrderVM order)
        {
            WorkOrderVM workOrder = new WorkOrderVM();

            int remainingOrderQty = order.OrderQuantity;

            using (ApplicationDbContext db = new ApplicationDbContext())
            {
                Order dbOrder = db.Orders.FirstOrDefault(o => o.OrderId == order.OrderId);
                workOrder.ToDepartmentId = dbOrder.DepartmentId;
                workOrder.ToDepartmentName = dbOrder.Department.DepartmentName;
                workOrder.ToFirstName = dbOrder.ApplicationUser.FirstName;
                workOrder.ToLastName = dbOrder.ApplicationUser.LastName;
                workOrder.Email = dbOrder.ApplicationUser.Email;

                List<ItemLocationXref> itemLocations = db.ItemLocationXrefs.Where(l => l.ItemId == order.ItemId).ToList();

                foreach (ItemLocationXref item in itemLocations)
                {
                    if (remainingOrderQty > 0)
                    {
                        WorkOrderItemVM workOrderItem = new WorkOrderItemVM();
                        workOrderItem.OrderId = order.OrderId;
                        workOrderItem.ItemId = order.ItemId;
                        workOrderItem.ItemName = item.Item.ItemName;
                        workOrderItem.LocationId = item.LocationId;
                        workOrderItem.LocationName = item.Location.LocationName;
                        workOrderItem.ItemBarCode = item.Item.BarCode;

                        if (item.QuantityOnPallet <= remainingOrderQty)
                        {
                            //location has less items than remainingOrderQty
                            workOrderItem.QuantityFromLocation = item.QuantityOnPallet;
                            remainingOrderQty = remainingOrderQty - item.QuantityOnPallet;
                            db.ItemLocationXrefs.Remove(item);
                            workOrderItem.IsRemovePallet = true;
                        }
                        else
                        {
                            //location has more items than remainingOrderQty
                            workOrderItem.QuantityFromLocation = remainingOrderQty;
                            item.QuantityOnPallet = item.QuantityOnPallet - remainingOrderQty;
                            remainingOrderQty = 0;
                        }

                        workOrder.WorkOrderItems.Add(workOrderItem);
                        db.SaveChanges();
                    }
                }

                ItemProcessing.UpdateItemTotalQuantity(order.ItemId);
            }

            return workOrder;
        }


    }
}