using Sabio.Models.AppSettings;
using Sabio.Models.Requests;
using Sabio.Models.Requests.Users;
using sib_api_v3_sdk.Model;
using Task = System.Threading.Tasks.Task;

namespace Sabio.Services.Interfaces
{
    public interface IEmailService
    {
        void SendContactUsEmail(ContactUsRequest model);
        void SendEmailConfirm(UserAddRequest model, string emailToken);
        void SendResetPassword(string email, string resetToken);
        void SubscribeEmail(NewsletterSubscriptionAddRequest model);
        void UnsubcribeEmail(NewsletterSubscriptionUpdateRequest model);


        void SendPasswordChanged(string email, string changedPasswordToken);
    }
}
