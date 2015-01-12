using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace inventory_control.Models
{
    public class OrderVM
    {
        public int OrderId { get; set; }
        public int ItemId { get; set; }
        public string ItemName { get; set; }
        public string UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; }
        public int OrderQuantity { get; set; }
        public int QuantityInStock { get; set; }
        public DateTime BeginTimestamp { get; set; }
        public DateTime? EndTimestamp { get; set; }
        public bool IsComplete { get; set; }
        public bool UserDeleted { get; set; }
        public bool AdminConfirmedDelete { get; set; }
        public bool IsDenied { get; set; }
        public bool IsApproved { get; set; }
        public string DeniedReason { get; set; }
        public bool IsQtyModified { get; set; }
        public int OriginalQty { get; set; }

        public WorkOrderVM WorkOrder { get; set; }
 
    }
    public class OrdersVM
    {
        public List<OrderVM> Orders { get; set; }

    }

    public class WorkOrderItemVM
    {
        public int ItemId { get; set; }
        public string ItemName { get; set; }
        public int LocationId { get; set; }
        public string LocationName { get; set; }
        public string ItemBarCode { get; set; }
        public int QuantityFromLocation { get; set; }
        public int OrderId { get; set; }
        public bool IsRemovePallet { get; set; }
    }

    public class WorkOrderVM
    {
        public int OrderId { get; set; }
        public int ToDepartmentId { get; set; }
        public string ToDepartmentName { get; set; }
        public string ToFirstName { get; set; }
        public string ToLastName { get; set; }
        public string Email { get; set; }

        public List<WorkOrderItemVM> WorkOrderItems { get; set; }

        public WorkOrderVM()
        {
            WorkOrderItems = new List<WorkOrderItemVM>();
        }
    }
}