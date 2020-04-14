using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Amazon.SimpleEmail;
using Amazon.SimpleEmail.Model;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.Extensions.Logging;

namespace Dalystudio.biz.Services.EmailSenders
{
    public class AmazonSesEmailSender : IEmailSender
    {
        private readonly IAmazonSimpleEmailService _client;
        private readonly ILogger<AmazonSesEmailSender> _logger;

        public AmazonSesEmailSender(IAmazonSimpleEmailService client, ILogger<AmazonSesEmailSender> logger)
        {
            _client = client;
            _logger = logger;
        }

        public Task SendEmailAsync(string email, string subject, string htmlMessage)
        {
            var sendRequest = new SendEmailRequest
            {
                Source = Settings.SupportEmail,
                Destination = new Destination
                {
                    ToAddresses =
                        new List<string> { email }
                },
                Message = new Message
                {
                    Subject = new Content(subject),
                    Body = new Body
                    {
                        Html = new Content
                        {
                            Charset = "UTF-8",
                            Data = htmlMessage
                        },
                        Text = new Content
                        {
                            Charset = "UTF-8",
                            Data = htmlMessage
                        }
                    }
                },
            };
            return _client.SendEmailAsync(sendRequest);

        }

    }
}
