using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace Dalystudio.biz.Services.GoogleRecaptcha
{
    public class GoogleRecaptcha : IGoogleRecaptcha
    {
        private ReCaptchaClass ReCaptchaClass { get; set; }
        private readonly ILogger<GoogleRecaptcha> _logger;
        public ReCaptchaClass GoogleCaptchaResponse { get; set; }
        public GoogleRecaptcha(IOptions<ReCaptchaClass> options, ILogger<GoogleRecaptcha> logger)
        {
            ReCaptchaClass = options.Value;
            _logger = logger;
        }


        public async Task<bool> IsCaptchaValid(string encodedResponse, string action)
        {
            return await Validate(encodedResponse, action);
        }

        private async Task<bool> Validate(string encodedResponse, string action)
        {
            var client = new System.Net.WebClient();
            try
            {
                var googleReply = await client.DownloadStringTaskAsync(string.Format(
                    "https://www.google.com/recaptcha/api/siteverify?secret={0}&response={1}",
                    ReCaptchaClass.SecretKey,
                    encodedResponse
                    )
                );
                GoogleCaptchaResponse = Newtonsoft.Json.JsonConvert.DeserializeObject<ReCaptchaClass>(googleReply);
                if (GoogleCaptchaResponse.Success && action == GoogleCaptchaResponse.Action)
                {
                    return true;
                }
                else
                {
                    _logger.Log(LogLevel.Warning, "Captcha validation failed:", GoogleCaptchaResponse);
                    return false;
                }
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, ex, "Google Recaptcha validate failed");
                return false;
            }
        }
    }

    public class ReCaptchaClass
    {
        public string SiteKey { get; set; }
        public string SecretKey { get; set; }

        [JsonProperty("success")]
        public bool Success
        {
            get { return _mSuccess; }
            set { _mSuccess = value; }
        }
        private bool _mSuccess;

        [JsonProperty("score")]
        public decimal Score
        {
            get { return _mScore; }
            set { _mScore = value; }
        }
        private decimal _mScore;

        [JsonProperty("action")]
        public string Action
        {
            get { return _mAction; }
            set { _mAction = value; }
        }
        private string _mAction;

        [JsonProperty("hostname")]
        public string Hostname
        {
            get { return _mHostname; }
            set { _mHostname = value; }
        }
        private string _mHostname;


        [JsonProperty("challenge_ts")]
        public DateTime TimeStamp
        {
            get { return _mTimeStamp; }
            set { _mTimeStamp = value; }
        }
        private DateTime _mTimeStamp;



        [JsonProperty("error-codes")]
        public List<string> ErrorCodes
        {
            get { return _mErrorCodes; }
            set { _mErrorCodes = value; }
        }
        private List<string> _mErrorCodes;
    }

}
