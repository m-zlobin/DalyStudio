using System;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;


namespace Dalystudio.biz.Extensions
{
    public static class Extensions
    {
        public static string UppercaseFirstLetter(this String str)
        {
            if (string.IsNullOrEmpty(str))
            {
                return string.Empty;
            }
            var a = str.ToCharArray();
            a[0] = char.ToUpper(a[0]);
            return new string(a);
        }
        public static string Truncate(this string value, int maxLength)
        {
            if (string.IsNullOrEmpty(value)) return value;
            return value.Length <= maxLength ? value : value.Substring(0, maxLength);
        }

        public static bool IsWebP(this HttpContext context)
        {
            bool isWebP = false;
            var isAccept = context.Request.Headers.TryGetValue("Accept", out var acceptHeader);
            if (isAccept && !StringValues.IsNullOrEmpty(acceptHeader))
            {
                var headerValue = acceptHeader.ToArray().FirstOrDefault();
                if (!string.IsNullOrEmpty(headerValue) && headerValue.Contains("image/webp"))
                {
                    isWebP = true;
                    context.Response.Headers.Add("Vary", "Accept");
                }
            }
            return isWebP;
        }

    }
}
