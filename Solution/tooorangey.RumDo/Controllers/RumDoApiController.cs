using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Umbraco.Core;
using Umbraco.Core.Models;
using Umbraco.Core.Services;
using Umbraco.Web.WebApi;

namespace tooorangey.RumDo.Controllers
{
    public class RumDoApiController : UmbracoAuthorizedApiController
    {
        [HttpPost]
        public IHttpActionResult CreateRedirect(RedirectInstruction instruction)
        {
            var redirectUrlService = Services.RedirectUrlService;
            var domainService = Services.DomainService;
            var contentService = Services.ContentService;

            if (!String.IsNullOrEmpty(instruction.ContentUdi))
            {
                instruction.ContentKey = GuidUdi.TryParse(instruction.ContentUdi, out var guidIdi) ? guidIdi.Guid : default(Guid);
            }
            try
            {
                var rootNodeId = GetRootNodeId(instruction, domainService, contentService);

                instruction.RedirectFromUrl = string.IsNullOrWhiteSpace(rootNodeId) 
                                                ? instruction.RedirectFromUrl 
                                                : rootNodeId + instruction.RedirectFromUrl;

                redirectUrlService.Register(instruction.RedirectFromUrl, instruction.ContentKey);

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        private string GetRootNodeId(RedirectInstruction instruction, IDomainService domainService, IContentService contentService)
        {
            var rootNodeId = string.Empty;
            var domains = domainService.GetAll(true).Where(x => x.RootContentId.HasValue).ToList();

            if (domains.Any())
            {
                var content = contentService.GetById(instruction.ContentKey);
                if (content == null) throw new Exception("Content item does not exist");

                var pathNodeIds = content.Path.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries).ToList();

                if (pathNodeIds.Any())
                {
                    var assignedDomain = domains.FirstOrDefault(x => pathNodeIds.Contains(x.RootContentId?.ToString()));
                    rootNodeId = assignedDomain?.RootContentId?.ToString() ?? string.Empty;
                }
            }

            return rootNodeId;
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