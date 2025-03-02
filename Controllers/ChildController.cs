using Microsoft.AspNetCore.Mvc;

namespace Server_Side.Controllers
{
    public class ChildController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
