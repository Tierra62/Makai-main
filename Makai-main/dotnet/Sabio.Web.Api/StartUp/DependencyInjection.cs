using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Sabio.Data;
using Sabio.Services;
using Sabio.Services.EmergencyContacts;
using Sabio.Services.Interfaces;
using Sabio.Services.Orders;
using Sabio.Services.FAQs;
using Sabio.Web.Api.StartUp.DependencyInjection;
using Sabio.Web.Core.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using Sabio.Services.Reservations;
using Sabio.Models.Interfaces;
using Sabio.Services.TwoFactor;

namespace Sabio.Web.StartUp
{
    public class DependencyInjection
    {
        public static void ConfigureServices(IServiceCollection services, IConfiguration configuration)
        {
            if (configuration is IConfigurationRoot)
            {
                services.AddSingleton<IConfigurationRoot>(configuration as IConfigurationRoot);   // IConfigurationRoot
            }

            services.AddSingleton<IConfiguration>(configuration);   // IConfiguration explicitly

            string connString = configuration.GetConnectionString("Default");
            // https://docs.microsoft.com/en-us/aspnet/core/fundamentals/dependency-injection?view=aspnetcore-2.2
            // The are a number of differe Add* methods you can use. Please verify which one you
            // should be using services.AddScoped<IMyDependency, MyDependency>();

            // services.AddTransient<IOperationTransient, Operation>();

            // services.AddScoped<IOperationScoped, Operation>();

            //services.AddSingleton<IOperationSingleton, Operation>();

            services.AddSingleton<IAuthenticationService<int>, WebAuthenticationService>();

            services.AddSingleton<ICheckoutSessionService, CheckoutSessionService>();

            services.AddSingleton<Sabio.Data.Providers.IDataProvider, SqlDataProvider>(delegate (IServiceProvider provider)
            {
                return new SqlDataProvider(connString);
            }
            );
            services.AddSingleton<IAdvertisementService, AdvertisementService>();

            services.AddSingleton<IAppointmentsService, AppointmentsService>();

            services.AddSingleton<IBaseUserMapper, UserService>();

            services.AddSingleton<IBlogService, BlogService>();

            services.AddSingleton<ICartService, CartService>();

            services.AddSingleton<IDonateService, DonateService>();

            services.AddSingleton<ICommentsService, CommentsService>();

            services.AddSingleton<IEmailService, EmailService>();

            services.AddSingleton<IEmergencyContactService, EmergencyContactService>();

            services.AddSingleton<IExternalLinkService, ExternalLinkService>();

            services.AddSingleton<IFaqsService, FaqsService>();

            services.AddSingleton<IFileService, FileService>();

            services.AddSingleton<IGoogleAnalyticsReportService, GoogleAnalyticsReportService>();

            services.AddSingleton<IGroupDiscountService, GroupsDiscountService>();

            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            services.AddSingleton<IIdentityProvider<int>, WebAuthenticationService>();

            services.AddSingleton<IInsuranceOptionService, InsuranceOptionService>();

            services.AddSingleton<ILessonService, LessonService>();

            services.AddSingleton<ILocationService, LocationService>();

            services.AddSingleton<ILookUpService, LookUpService>();

            services.AddSingleton<ILoyaltyPointService, LoyaltyPointService>();

            services.AddSingleton<ILoyaltyPointSourceService, LoyaltyPointSourceService>();

            services.AddSingleton<IMessageService, MessageService>();

            services.AddSingleton<INewslettersService, NewslettersService>();

            services.AddSingleton<INewsletterContentService, NewsletterContentService>();

            services.AddSingleton<INewsletterSubscriptionsService, NewsletterSubscriptionsService>();

            services.AddSingleton<INewsletterTemplateService, NewsletterTemplateService>();

            services.AddSingleton<IOrderService, OrderService>();

            services.AddSingleton<IPartnerService, PartnerService>();

            services.AddSingleton<IPodcastService, PodcastService>();

            services.AddSingleton<IProductService, ProductService>();


            services.AddSingleton<IRatingService, RatingService>();

            services.AddSingleton<IRecommendationService, RecommendationService>();

            services.AddSingleton<IReservationService, ReservationService>();

            services.AddSingleton<IReviewService, ReviewService>();

            services.AddSingleton<ISalesTaxService, SalesTaxService>();

            services.AddSingleton<IShareStoryService, ShareStoryService>();

            services.AddSingleton<ISiteReferenceService, SiteReferenceService>();

            services.AddSingleton<ISiteTrainingService, SiteTrainingService>();

            services.AddSingleton<IStandReturnService, StandReturnService>();

            services.AddSingleton<IStandService, StandService>();

            services.AddSingleton<IStandCodeService, StandCodeService>();

            services.AddSingleton<IStripeCartService, StripeCartService>();

            services.AddSingleton<IStripeConnectService, StripeConnectService>();

            services.AddSingleton<IStripeOrderReceiptService, StripeOrderReceiptService>();

            services.AddSingleton<IStripeUserService, StripeUserService>();

            services.AddSingleton<ISurveyAnswersService, SurveyAnswersService>();

            services.AddSingleton<ISurveyInstanceService, SurveyInstanceService>();

            services.AddSingleton<ISurveyService, SurveyService>();

            services.AddSingleton<ISurveyQuestionService, SurveyQuestionService>();

            services.AddSingleton<ITwoFactorService, TwoFactorService>();

            services.AddSingleton<IUserPhotosService, UserPhotosService>();

            services.AddSingleton<IUserService, UserService>();

           services.AddSingleton<IVideoChatService, VideoChatService>();

            services.AddSingleton<IWeatherService, WeatherService>();
            
            GetAllEntities().ForEach(tt =>
            {
                IConfigureDependencyInjection idi = Activator.CreateInstance(tt) as IConfigureDependencyInjection;

                //This will not error by way of being null. BUT if the code within the method does
                // then we would rather have the error loadly on startup then worry about debuging the issues as it runs
                idi.ConfigureServices(services, configuration);
            });
        }

        public static List<Type> GetAllEntities()
        {
            return AppDomain.CurrentDomain.GetAssemblies().SelectMany(x => x.GetTypes())
                 .Where(x => typeof(IConfigureDependencyInjection).IsAssignableFrom(x) && !x.IsInterface && !x.IsAbstract)
                 .ToList();
        }

        public static void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
        }
    }
}