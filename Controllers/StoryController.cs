using Microsoft.AspNetCore.Mvc;

namespace Server_Side.Controllers
{
    public class StoryController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
