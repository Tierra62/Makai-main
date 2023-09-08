using System.Collections.Generic;
using Stripe.Checkout;
using Sabio.Services.Interfaces;
using Stripe;
using Sabio.Models.Requests.Stripe;
using Sabio.Models.Domain.Stripe;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Mvc;

namespace Sabio.Services
{
    public class CheckoutSessionService : ICheckoutSessionService
    {
        private StripeKeys _stripeKeys = null;
        private HostUrl _hostUrl =null;
        public CheckoutSessionService(IOptions<StripeKeys> stripeKeys, IOptions<HostUrl> hostUrl) {
            _stripeKeys = stripeKeys.Value;
            _hostUrl = hostUrl.Value;
        }
        public string AddSession(SessionAddRequest newSession)
        {
            var domain = _hostUrl.Url;
            StripeConfiguration.ApiKey = _stripeKeys.SecretKey;
            var options = new SessionCreateOptions
            {
                LineItems = new List<SessionLineItemOptions>
                {
                // How can I map my cart to mulitple line items witht the order/insurance metadata
                // (if we have multiple orders for a single cart)
                  new SessionLineItemOptions
                  {
                        PriceData = new SessionLineItemPriceDataOptions
                        {
                         UnitAmount = newSession.Cost,
                         Currency = "usd",
                         ProductData = new SessionLineItemPriceDataProductDataOptions
                        {
                            Name = newSession.ProductName,
                        },
                    },
                    Quantity = newSession.Quantity,
                  },
                },
 
                Mode = "payment",
                SuccessUrl = domain + "/stripe/checkout/success?session_id={CHECKOUT_SESSION_ID}",
                CancelUrl = domain + "?canceled=true",
            };

            var service = new SessionService();
            Session session = service.Create(options);
            return session.Id;
        }

        public string ReservationAddSession(SessionAddRequest newSession)
        {
            var domain = _hostUrl.Url;
            StripeConfiguration.ApiKey = _stripeKeys.SecretKey;
            var options = new SessionCreateOptions
            {
                LineItems = new List<SessionLineItemOptions>
                {
                  new SessionLineItemOptions
                  {
                        PriceData = new SessionLineItemPriceDataOptions
                        {
                         UnitAmount = newSession.Cost,
                         Currency = "usd",
                         ProductData = new SessionLineItemPriceDataProductDataOptions
                        {
                            Name = newSession.ProductName,
                        },
                    },
                    Quantity = newSession.Quantity,
                  },
                },

                Mode = "payment",
                SuccessUrl = domain + "/stripe/checkout/reservation/success?session_id={CHECKOUT_SESSION_ID}",
                CancelUrl = domain + "?canceled=true",
            };

            var service = new SessionService();
            Session session = service.Create(options);
            return session.Id;
        }

        public Session GetOrderDetails(AddSessionDetailsRequest session_id)
        {
            StripeConfiguration.ApiKey = _stripeKeys.SecretKey;


            var service = new SessionService();
            Session sessionDetails = service.Get(session_id.SessionId);

            return sessionDetails;
        }

        public StripeList<LineItem> GetListLineItems(AddSessionDetailsRequest session_id)
        {
            StripeConfiguration.ApiKey = _stripeKeys.SecretKey;

            var options = new SessionListLineItemsOptions
            {
                // the user cannot have a cart with more than 100 different products
                // or that information will never be added the orders/insurance option table
                Limit = 100,
            };

            var service = new SessionService();
            StripeList<LineItem> lineItems = service.ListLineItems(session_id.SessionId, options);


            return lineItems;
        }

    }
}

