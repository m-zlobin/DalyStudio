using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using SmartBreadcrumbs;

namespace Dalystudio.biz.Controllers
{
    [Route("/", Name = "CultureLessHome")]
    public class HomeController : Controller
    {
        private ILogger<HomeController> _logger;
        private IRazorViewEngine _viewEngine;
        private BreadcrumbsManager _breadcrumbsManager;
        private Settings _settings;

        public HomeController(ILogger<HomeController> logger, IRazorViewEngine viewEngine, BreadcrumbsManager breadcrumbsManager, IOptions<Settings> settings)
        {
            _logger = logger;
            _viewEngine = viewEngine;
            _breadcrumbsManager = breadcrumbsManager;
            _settings = settings.Value;
        }

        [DefaultBreadcrumb("Home")]
        [Route("", Name = "HomeIndex")]
        public IActionResult Index(string culture)
        {
            return View();

        }

        [Route("contact", Name = "Contact")]
        [Breadcrumb("ViewData.Title", FromAction = "Home.Index")]
        public IActionResult Contact(string culture, string contactName, string contactEmail, string category, string typeOfService)
        {
            //}
            ViewBag.Name = TempData["contactName"] ?? "";
            ViewBag.Email = TempData["contactEmail"] ?? "";
            ViewBag.Category = TempData["category"] ?? "";
            ViewBag.TypeOfService = TempData["typeOfService"] ?? "";


            return View();
        }

        [Breadcrumb("ViewData.Title", FromAction = "Home.Index")]
        [Route("about", Name = "About")]
        public IActionResult About(string culture)
        {
            return View();
        }
        [Breadcrumb("ViewData.Title", FromAction = "Home.Index")]
        [Route("project1", Name = "Project1")]
        public IActionResult Project1(string culture)
        {
            return View();
        }
        [Breadcrumb("ViewData.Title", FromAction = "Home.Index")]
        [Route("project2", Name = "Project2")]
        public IActionResult Project2(string culture)
        {
            return View();
        }
        [Breadcrumb("ViewData.Title", FromAction = "Home.Index")]
        [Route("project3", Name = "Project3")]
        public IActionResult Project3(string culture)
        {
            return View();
        }
        [Breadcrumb("ViewData.Title", FromAction = "Home.Index")]
        [Route("project4", Name = "Project4")]
        public IActionResult Project4(string culture)
        {
            return View();
        }
        [Breadcrumb("ViewData.Title", FromAction = "Home.Index")]
        [Route("portfolio", Name = "Portfolio")]
        public IActionResult Portfolio(string culture)
        {
            return View();
        }

        [Breadcrumb("ViewData.Title", FromAction = "Home.Index")]
        [Route("sitemap", Name = "Sitemap")]
        public IActionResult Sitemap(string culture)
        {
            return View();
        }

        [Breadcrumb("ViewData.Title", FromAction = "Home.Index")]
        [Route("workflow", Name = "Workflow")]
        public IActionResult Workflow(string culture)
        {
            return View();
        }

        [Breadcrumb("ViewData.Title", FromAction = "Home.Index")]
        [Route("team", Name = "Team")]
        public IActionResult Team(string culture)
        {
            return View();
        }

        [Breadcrumb("ViewData.Title", FromAction = "Home.Index")]
        [Route("faq", Name = "Faq")]
        public IActionResult Faq(string culture)
        {
            return View();
        }

        [Breadcrumb("ViewData.Title", FromAction = "Home.Index")]
        [Route("price", Name = "Price")]
        public IActionResult Price(string culture)
        {
            return View();
        }

        [Route("error/404")]
        public IActionResult Error404()
        {
            return View();
        }

        [Route("error/{code:int}")]
        public IActionResult Error(int code)
        {
            // handle different codes or just return the default error view
            return View();
        }


        [HttpPost]
        [Route("get-started", Name = "GetStartedForm")]
        public IActionResult GetStartedForm(string contactName, string contactEmail, string category, string typeOfService)
        {
            TempData["contactName"] = contactName;
            TempData["contactEmail"] = contactEmail;
            TempData["category"] = category;
            TempData["typeOfService"] = typeOfService;

            return RedirectToAction("Contact", "Home", null, "contact-section");
        }
    }
}
