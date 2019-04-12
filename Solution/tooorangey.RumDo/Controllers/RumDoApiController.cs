using System;
using System.Collections.Generic;
using System.Web.Http;
using Umbraco.Core;
using Umbraco.Core.Models;
using Umbraco.Web.WebApi;

namespace tooorangey.RumDo.Controllers
{
    public class RumDoApiController : UmbracoAuthorizedApiController
    {
        [HttpPost]
        public IHttpActionResult CreateRedirect(RedirectInstruction instruction)
        {
            var redirectUrlService = Services.RedirectUrlService;
            if (!String.IsNullOrEmpty(instruction.ContentUdi))
            {
                GuidUdi guidIdi;
                instruction.ContentKey = GuidUdi.TryParse(instruction.ContentUdi, out guidIdi) ? guidIdi.Guid : default(Guid);
            }
            try
            {

                redirectUrlService.Register(instruction.RedirectFromUrl, instruction.ContentKey);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }
        [HttpGet]
        public IEnumerable<IRedirectUrl> GetContentRedirectUrls(string contentUdi)
        {
            GuidUdi guidIdi;
            var contentKey = GuidUdi.TryParse(contentUdi, out guidIdi) ? guidIdi.Guid : default(Guid);
            var redirectUrlService = Services.RedirectUrlService;
            var redirects = redirectUrlService.GetContentRedirectUrls(contentKey);
            return redirects;
        }
        public class RedirectInstruction
        {
            public string RedirectFromUrl { get; set; }
            public Guid ContentKey { get; set; }

            public string ContentUdi { get; set; }

        }

    }
}