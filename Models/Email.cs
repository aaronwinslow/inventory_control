using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Web;

namespace inventory_control.Models
{
    public static class Email
    {
        public static void Send(MailModel objModelMail)
        {
            try 
            { 
                MailMessage mail = new MailMessage();
                mail.IsBodyHtml = true;
                mail.To.Add(objModelMail.To);
                mail.From = new MailAddress(objModelMail.From);
                mail.Subject = objModelMail.Subject;
                string Body = objModelMail.Body;
                mail.Body = Body;
                mail.IsBodyHtml = true;
                SmtpClient smtp = new SmtpClient();
                smtp.Host = "smtp.sendgrid.net";
                smtp.Port = 587;
                smtp.UseDefaultCredentials = false;
                smtp.Credentials = new System.Net.NetworkCredential
                ("", "");// name and password  
                smtp.EnableSsl = true;
                smtp.Send(mail);
            }
            catch
            {

            }
        }
    }
}