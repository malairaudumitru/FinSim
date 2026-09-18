using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace FinSim.BusinessLayer.Core;

public class EmailSender
{
    public async Task SendAsync(string to, string subject, string htmlBody)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(EmailSettings.SenderName, EmailSettings.Address));
        message.To.Add(MailboxAddress.Parse(to));
        message.Subject = subject;
        message.Body = new TextPart("html") { Text = htmlBody };

        using var client = new SmtpClient();
        await client.ConnectAsync(EmailSettings.SmtpHost, EmailSettings.SmtpPort, SecureSocketOptions.StartTls);
        await client.AuthenticateAsync(EmailSettings.Address, EmailSettings.AppPassword);
        await client.SendAsync(message);
        await client.DisconnectAsync(true);
    }
}
