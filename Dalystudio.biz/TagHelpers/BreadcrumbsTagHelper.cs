using System.Text;
using System.Threading.Tasks;
using Dalystudio.biz.Extensions;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using SmartBreadcrumbs;

namespace Dalystudio.biz.TagHelpers
{
    [HtmlTargetElement("breadcrumbs")]
    public class BreadcrumbsTagHelper : TagHelper
    {
        #region Fields

        private readonly BreadcrumbsManager _breadcrumbsManager;
        private readonly UrlHelper _urlHelper;

        #endregion

        #region Properties

        [ViewContext]
        [HtmlAttributeNotBound]
        public ViewContext ViewContext { get; set; }

        public bool IsDefaultCulture { get; set; }
        #endregion

        public BreadcrumbsTagHelper(BreadcrumbsManager breadcrumbsManager, IActionContextAccessor actionContextAccessor)
        {
            _breadcrumbsManager = breadcrumbsManager;
            _urlHelper = new UrlHelper(actionContextAccessor.ActionContext);
        }

        public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
        {
            var child = await output.GetChildContentAsync();

            string action = ViewContext.ActionDescriptor.RouteValues["action"];
            string controller = ViewContext.ActionDescriptor.RouteValues["controller"];

            var nodeKey = $"{controller}.{action}";
            var node = ViewContext.ViewData["BreadcrumbNode"] as BreadcrumbNode ?? _breadcrumbsManager.GetNode(nodeKey);

            output.TagName = _breadcrumbsManager.Options.TagName;
            output.Attributes.Add("aria-label", "breadcrumb");
            // Tag Classes
            if (!string.IsNullOrEmpty(_breadcrumbsManager.Options.TagClasses))
            {
                output.Attributes.Add("class", _breadcrumbsManager.Options.TagClasses);
            }

            output.Content.AppendHtml($"<ol class=\"{_breadcrumbsManager.Options.OlClasses}\" itemscope itemtype=\"http://schema.org/BreadcrumbList\">");

            var sb = new StringBuilder();

            if (node == null || (node.Parent == null && node.Action == "Index"))
            {
                output.Content.SetHtmlContent("");
                return;
            }

            var nestingLevel = GetNestingLevel(node);
            if (node != null)
            {
                if (node.CacheTitle && node.Title.StartsWith("ViewData."))
                    node.Title = ExtractTitle(node.Title);

                sb.Append($"<li{GetClass(_breadcrumbsManager.Options.ActiveLiClasses)} aria-current='page' itemprop=\"itemListElement\" itemscope itemtype = \"http://schema.org/ListItem\">" +
                          $"<a itemtype=\"http://schema.org/Thing\" itemprop=\"item\" href=\"{ViewContext.HttpContext.Request.Scheme}://{ViewContext.HttpContext.Request.Host}{node.GetUrl(_urlHelper)}\"><span itemprop=\"name\">{ExtractTitle(node.Title).UppercaseFirstLetter()}</span></a>" +
                          $"<meta itemprop=\"position\" content=\"{nestingLevel--}\" />" +
                          $"</li>");

                while (node.Parent != null)
                {
                    node = node.Parent;

                    // Separator
                    if (_breadcrumbsManager.Options.HasSeparatorElement)
                    {
                        sb.Insert(0, _breadcrumbsManager.Options.SeparatorElement);
                    }

                    sb.Insert(0, $"<li{GetClass(_breadcrumbsManager.Options.LiClasses)}  itemprop=\"itemListElement\" itemscope itemtype = \"http://schema.org/ListItem\">" +
                                 $"<a itemtype=\"http://schema.org/Thing\" itemprop=\"item\"  href=\"{ViewContext.HttpContext.Request.Scheme}://{ViewContext.HttpContext.Request.Host}{node.GetUrl(_urlHelper)}\"><span itemprop=\"name\">{node.Title.UppercaseFirstLetter()}</span></a>" +
                                 $"<meta itemprop=\"position\" content=\"{nestingLevel--}\" />" +
                                 $"</li>");
                }
            }

            // If the node was custom and it had no defaultnode
            if (node != _breadcrumbsManager.DefaultNode)
            {
                // Separator
                if (_breadcrumbsManager.Options.HasSeparatorElement)
                {
                    sb.Insert(0, _breadcrumbsManager.Options.SeparatorElement);
                }

                sb.Insert(0, $"<li{GetClass(_breadcrumbsManager.Options.LiClasses)}><a href=\"{ViewContext.HttpContext.Request.Scheme}://{ViewContext.HttpContext.Request.Host}{_breadcrumbsManager.DefaultNode.GetUrl(_urlHelper)}\">{_breadcrumbsManager.DefaultNode.Title.UppercaseFirstLetter()}</a></li>");
            }

            output.Content.AppendHtml(sb.ToString());
            output.Content.AppendHtml(child);
            output.Content.AppendHtml("</ol>");

        }

        private string ExtractTitle(string title)
        {
            if (!title.StartsWith("ViewData."))
                return title;

            string key = title.Substring(9);
            return ViewContext.ViewData.ContainsKey(key) ? ViewContext.ViewData[key].ToString() : key;
        }

        private string GetClass(string classes)
        {
            if (string.IsNullOrEmpty(classes))
                return "";

            return $" class=\"{classes}\"";
        }

        private int GetNestingLevel(BreadcrumbNode node)
        {
            var level = 1;
            while (node.Parent != null)
            {
                node = node.Parent;
                level++;
            }

            return level;
        }
    }

}
