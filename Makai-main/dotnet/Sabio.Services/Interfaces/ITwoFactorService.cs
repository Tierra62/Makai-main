using Sabio.Models.Requests;
using System.Threading.Tasks;

namespace Sabio.Services.Interfaces
{
    public interface ITwoFactorService
    {
        Task CreateSms(TwoFactorRequest model);
        Task<string> CheckSms(string mobilePhone, string code);
    }
}