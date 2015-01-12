using inventory_control.Adapters;
using inventory_control.Adapters.Data;
using inventory_control.Data.Models;
using inventory_control.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace inventory_control.Controllers
{
    [RoutePrefix("order")]
    public class OrderController : ApiController
    {
        private IOrderAdapter _adapter;

        public OrderController()
        {
            _adapter = new OrderDataAdapter();
        }

        //GET: order/all
        [Route("all")]
        [Authorize(Roles = Role.ADMIN_GENERAL)]
        public IHttpActionResult GetOrders()
        {

            OrdersVM model = _adapter.GetOrders();

            return Ok(model);
        }

        //GET: order/{id}
        [Route("{orderId}")]
        [Authorize(Roles = Role.ADMIN_GENERAL)]
        public IHttpActionResult GetOrder(int orderId)
        {

            OrdersVM model = _adapter.GetOrder(orderId);

            return Ok(model);
        }


        //GET: order/user/{userId}
        [Route("user/{userId}")]
        [Authorize(Roles = Role.ADMIN_GENERAL)]
        public IHttpActionResult GetOrderByUser(string userId)
        {

            OrdersVM model = _adapter.GetOrderByUser(userId);

            return Ok(model);
        }

        //POST: order/create
        [Route("create")]
        [Authorize(Roles = Role.ADMIN_GENERAL)]
        public IHttpActionResult SaveOrder(OrderVM order)
        {
            _adapter.CreateOrder(order);

            OrdersVM model = _adapter.GetOrder(order.OrderId);
            if (model.Orders == null)
            {
                model.Orders = new List<OrderVM>();
            }

            return Ok(model);
        }

        //POST: order/update
        [Route("update")]
        [Authorize(Roles = Role.ADMIN_GENERAL)]
        public IHttpActionResult UpdateOrder(OrderVM order)
        {
            _adapter.UpdateOrder(order);


            OrderProcessing process = new OrderProcessing();
            WorkOrderVM workOrder = new WorkOrderVM();
            OrdersVM model = _adapter.GetOrder(order.OrderId);

            if (order.IsApproved)
            {
                //create work order and adjust quantities on item locations
                workOrder = process.ProcessOrderApproval(order);

                //create work order email body
                string body = "New Warehouse Work Order" + "<br/>";
                body = "" + "<br/>";
                body += "Order Id: " + workOrder.OrderId + "<br/>";
                body += "Contact Name: " + workOrder.ToFirstName + " " + workOrder.ToLastName + "<br/>";
                body += "Order Id: " + workOrder.Email + "<br/>";
                body += "" + "<br/>";
                body += "Item Id: " + workOrder.WorkOrderItems[0].ItemId + "<br/>";
                body += "Item Id: " + workOrder.WorkOrderItems[0].ItemName + "<br/>";
                body += "Item Id: " + workOrder.WorkOrderItems[0].ItemBarCode + "<br/>";
                body += "" + "<br/>";
                body += "Work Order Items" + "<br/>";
                body += "---------------------------------------------" + "<br/>";
                body += "" + "<br/>";

                foreach (WorkOrderItemVM item in workOrder.WorkOrderItems)
                {
                    body += "Location: " + item.LocationName + "<br/>";
                    body += "Location Id: " + item.LocationId + "<br/>";
                    body += "Quantity to Get: " + item.QuantityFromLocation + "<br/>";
                    body += "Remove Pallet: " + item.IsRemovePallet + "<br/>";
                    body += "" + "<br/>";
                }

                MailModel mail = new MailModel();
                mail.From = "admin@inventorycontrol.tk";
                mail.To = "warehouse@inventorycontrol.tk, records@inventorycontrol.tk";
                mail.Subject = "Order Fulfillment";
                mail.Body = body;

                Email.Send(mail);

            }

            else if (order.IsDenied)
            {
                //create work order email body
                string body = "Denied Order" + "<br/>";
                body = "" + "<br/>";
                body += "Order Id: " + model.Orders[0].OrderId + "<br/>";
                body += "" + "<br/>";
                body += "Original Quantity: " + model.Orders[0].OriginalQty + "<br/>";
                body += "New Quantity: " + model.Orders[0].OrderQuantity + "<br/>";
                body += "New Quantity: " + model.Orders[0].DeniedReason + "<br/>";
                body += "" + "<br/>";
                body += "---------------------------------------------" + "<br/>";
                body += "" + "<br/>";


                MailModel mail = new MailModel();
                mail.From = "admin@inventorycontrol.tk";
                mail.To = "records@inventorycontrol.tk";
                mail.Subject = "Order Fulfillment";
                mail.Body = body;

                Email.Send(mail);

            }

            else if (order.IsQtyModified && workOrder.WorkOrderItems == null)
            {
                try
                {
                    //create work order email body
                    string body = "Modified Order" + "<br/>";
                    body = "" + "<br/>";
                    body += "Order Id: " + model.Orders[0].OrderId + "<br/>";
                    body += "" + "<br/>";
                    body += "Original Quantity: " + model.Orders[0].OriginalQty + "<br/>";
                    body += "New Quantity: " + model.Orders[0].OrderQuantity + "<br/>";
                    body += "" + "<br/>";
                    body += "---------------------------------------------" + "<br/>";
                    body += "" + "<br/>";


                    MailModel mail = new MailModel();
                    mail.From = "admin@inventorycontrol.tk";
                    mail.To = "records@inventorycontrol.tk";
                    mail.Subject = "Order Fulfillment";
                    mail.Body = body;

                    Email.Send(mail);
                }

                catch { }
            }

            model.Orders[0].WorkOrder = workOrder;

            return Ok(model);
        }



    }
}
