using Microsoft.Extensions.Options;
using Sabio.Models.Domain.Stripe;
using Sabio.Models.Requests.Stripe;
using Stripe.Checkout;
using Stripe;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Reflection.Metadata.Ecma335;
using Sabio.Services.Interfaces;

namespace Sabio.Services
{
    public class StripeConnectService : IStripeConnectService
    {
        private StripeKeys _stripeKeys = null;
        private HostUrl _hostUrl = null;

        public StripeConnectService(IOptions<StripeKeys> stripeKeys, IOptions<HostUrl> hostUrl)
        {
            _stripeKeys = stripeKeys.Value;
            _hostUrl = hostUrl.Value;
        }
        public string AddAccount(AccountAddRequest userInfo)
        {
            StripeConfiguration.ApiKey = _stripeKeys.SecretKey;
            var options = new AccountCreateOptions
            {
                Type = "custom",
                Country = "US",
                Email = userInfo.Email,
                Capabilities = new AccountCapabilitiesOptions
                {
                    CardPayments = new AccountCapabilitiesCardPaymentsOptions
                    {
                        Requested = true,
                    },
                    Transfers = new AccountCapabilitiesTransfersOptions
                    {
                        Requested = true,
                    },
                },
            };
            var service = new AccountService();
            Account account = service.Create(options);
            return account.Id;
        }

        public string AddAccountLink(AccountLinkAddRequest userInfo)
        {
            var domain = _hostUrl.Url;
            StripeConfiguration.ApiKey = _stripeKeys.SecretKey;

            var options = new AccountLinkCreateOptions
            {
                Account = userInfo.AccountId,
                RefreshUrl = domain + "/stripe/partner",
                ReturnUrl = domain + "/stripe/partner",
                Type = "account_onboarding",
            };
            var service = new AccountLinkService();
            AccountLink accountLink = service.Create(options);
            return accountLink.Url;
        }

        public Account GetAccount(string accountId)
        {
           StripeConfiguration.ApiKey = _stripeKeys.SecretKey;
           var service = new AccountService();
           Account userAccount = service.Get(accountId);
           return userAccount;
        }
        public string TransferPayment(TransferPaymentRequest payment)
        {
            StripeConfiguration.ApiKey = _stripeKeys.SecretKey;

            var options = new TransferCreateOptions
            {
                Amount = payment.Amount,
                Currency = "usd",
                Destination = payment.AccountId
            };
            var service = new TransferService();
            Transfer transfer = service.Create(options);
           
            return transfer.Id;
        }
        public Transfer GetTransfer(AccountLinkAddRequest transferId)
        {
            StripeConfiguration.ApiKey = _stripeKeys.SecretKey;
            var service = new TransferService();
            Transfer transferRecord = service.Get(transferId.AccountId);
            
            return transferRecord;
        }
    }
}
