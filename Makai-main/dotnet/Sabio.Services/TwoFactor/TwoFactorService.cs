using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;
using Sabio.Data.Providers;
using Sabio.Models.AppSettings;
using Sabio.Models.Domain.Stripe;
using Sabio.Models.Requests;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Twilio;
using Twilio.Rest.Verify.V2;
using Twilio.Rest.Verify.V2.Service;

namespace Sabio.Services.TwoFactor

{
    public class TwoFactorService : ITwoFactorService
    {

        private string accountSid = "AC6ff7e6dae5b0803f369e2dc4b21d6287";
        private string authToken = "62655e9317dd313fccfc3ba985feab5a";
        private ServiceResource service;

        public TwoFactorService()
        {
            TwilioClient.Init(accountSid, authToken);

            service = ServiceResource.Create(friendlyName: "My First Verify Service");
            Console.WriteLine(service.Sid);
        }


        public async Task CreateSms(TwoFactorRequest model)
        {
            var verification = await VerificationResource.CreateAsync(
               to: model.MobilePhone,
               channel: "sms",
               pathServiceSid: service.Sid
           );
            
            Console.WriteLine(verification.Status);
        }
        
        public async Task<string> CheckSms(string mobilePhone, string code)
        {
            var verificationCheck = await VerificationCheckResource.CreateAsync(
            to: mobilePhone,
            code: code,
            pathServiceSid: service.Sid
            );
            
            return verificationCheck.Status;
        }

    }
}
