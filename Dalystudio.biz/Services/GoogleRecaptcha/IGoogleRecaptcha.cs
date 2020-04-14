using System.Threading.Tasks;

namespace Dalystudio.biz.Services.GoogleRecaptcha
{
    public interface IGoogleRecaptcha
    {
        Task<bool> IsCaptchaValid(string encodedResponse, string action);
    }
}
