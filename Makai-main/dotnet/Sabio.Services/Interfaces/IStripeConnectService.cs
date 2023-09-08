using Sabio.Models.Requests.Stripe;
using Stripe;

namespace Sabio.Services.Interfaces
{
    public interface IStripeConnectService
    {
        string AddAccount(AccountAddRequest userInfo);
        string AddAccountLink(AccountLinkAddRequest userInfo);
        Account GetAccount(string accountId);
        string TransferPayment(TransferPaymentRequest payment);
        Transfer GetTransfer(AccountLinkAddRequest transferId);
    }
}