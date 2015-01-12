using inventory_control.Data;
using inventory_control.Data.Models;
using inventory_control.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace inventory_control.Adapters.Data
{
    public class ItemProcessing
    {

        internal static void UpdateItemTotalQuantity(int itemId)
        {
            using (ApplicationDbContext db = new ApplicationDbContext())
            {
                Item dbItem = db.Items.FirstOrDefault(i => i.ItemId == itemId);

                if (dbItem != null)
                {
                    List<ItemLocationXref> items = db.ItemLocationXrefs.Where(i => i.ItemId == itemId).ToList();

                    int count = 0;

                    foreach (var item in items)
                    {
                        count += item.QuantityOnPallet;
                    }

                    dbItem.QuantityInStock = count;

                    db.SaveChanges();
                
                    if (dbItem.QuantityInStock > dbItem.MinQuantity && dbItem.ThreshHoldEmailSent == true)
                    {
                        dbItem.ThreshHoldEmailSent = false;
                    }

                    db.SaveChanges();
                }

            }
        }

        internal static string ProcessThresholdQuantities()
        {
            using (ApplicationDbContext db = new ApplicationDbContext())
            {
                List<Item> dbItems = db.Items.ToList();

                foreach (Item item in dbItems)
                {
                    if (item.QuantityInStock <= item.MinQuantity && item.ThreshHoldEmailSent == false)
                    {
                        item.ThreshHoldEmailSent = true;

                        //create email for purchasing to get new inventory
                        string body = "Notice To Reorder Product" + "<br/>";
                        body += "---------------------------------------------" + "<br/>";
                        body = "" + "<br/>";
                        body += "Item Id:           " + item.ItemId + "<br/>";
                        body += "Item Name:         " + item.ItemName + "<br/>";
                        body += "Quantity In Stock: " + item.QuantityInStock + "<br/>";
                        body += "Min Quantity:      " + item.MinQuantity + "<br/>";
                        body += "Max Quantity:      " + item.MaxQuantity + "<br/>";
                        body += "Supplier Name:     " + item.Supplier.SupplierName + "<br/>";
                        body += "Supplier Part Id:  " + item.SupplierPart.SupplierPartName + "<br/>";
                        body += "" + "<br/>";
                        body += "Work Order Items" + "<br/>";
                        body += "---------------------------------------------" + "<br/>";
                        body += "" + "<br/>";
                        body += "" + "<br/>";


                        MailModel mail = new MailModel();
                        mail.From = "admin@inventorycontrol.tk";
                        mail.To = "purchasing@inventorycontrol.tk";
                        mail.Subject = "Reorder Product";
                        mail.Body = body;

                        Email.Send(mail);
                    }
                }

                return "Email Sent";
            }
        }
    }
}