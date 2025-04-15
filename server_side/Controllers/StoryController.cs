using Microsoft.AspNetCore.Mvc;
using Server_Side.BL;
using Server_Side.DAL;
using System.Threading.Tasks;

namespace Server_Side.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StoryController : ControllerBase
    {
        private readonly StoryDBservices _storyDBservices;

        // Constructor to inject StoryDBservices
        public StoryController(StoryDBservices storyDBservices)
        {
            _storyDBservices = storyDBservices;
        }

        // API לקבלת סיפור מתאים לילד לפי רמת קריאה ונושא
        [HttpGet("GetStoryForChild/{childID}/{topic}")]
        public async Task<IActionResult> GetStoryForChild(string childID, string topic)
        {
            var story = await _storyDBservices.GetStoryForChildAsync(childID, topic);

            if (story == null)
            {
                return NotFound($"No story found for child {childID} with topic '{topic}'.");
            }

            return Ok(story);
        }

        // API לקבלת רשימת ספרים שהילד קרא
        [HttpGet("GetBooksReadByChild/{childID}")]
        public async Task<IActionResult> GetBooksReadByChild(string childID)
        {
            var booksRead = await _storyDBservices.GetBooksReadByChildAsync(childID);

            if (booksRead == null || booksRead.Count == 0)
            {
                return NotFound($"No books found for child ID {childID}.");
            }

            return Ok(booksRead);
        }

        // קבלת ספר לפי ID
        [HttpGet("GetStoryById/{storyId}")]
        public async Task<IActionResult> GetStoryById(string storyId)
        {
            var story = await _storyDBservices.GetStoryByIdAsync(storyId);

            if (story == null)
            {
                return NotFound($"No story found with ID: {storyId}.");
            }

            return Ok(story);
        }
    }
}
