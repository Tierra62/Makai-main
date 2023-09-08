using Microsoft.AspNetCore.Mvc;
using Sabio.Models.Requests.Stripe;
using Stripe;
using Stripe.Checkout;

namespace Sabio.Services.Interfaces
{
    public interface ICheckoutSessionService
    {
        string AddSession(SessionAddRequest newSession);
        string ReservationAddSession(SessionAddRequest newSession);
        Session GetOrderDetails(AddSessionDetailsRequest session_id);
        StripeList<LineItem> GetListLineItems(AddSessionDetailsRequest session_id);
    }
}