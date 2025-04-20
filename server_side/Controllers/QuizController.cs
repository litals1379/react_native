using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using Server_Side.DAL;

namespace Server_Side.Controllers
{
    public class QuizController : Controller
    {
        private readonly DBservices _dbService;

        public QuizController(DBservices dbService)
        {
            _dbService = dbService;
        }

        [HttpGet("api/randomwords")] // Define the API endpoint
        public ActionResult<IEnumerable<string>> GetRandomWords()
        {
            List<string> words = _dbService.GetRandomWords(); // Call the method from DBservices

            if (words == null || words.Count == 0)
            {
                return NotFound(); // Return 404 if no words are found
            }

            return Ok(words); // Return 200 with the list of words
        }
    }
}
