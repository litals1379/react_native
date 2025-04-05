using Microsoft.AspNetCore.Mvc;

namespace Server_Side.Controllers
{
    public class FeedbackController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
