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
        //החזרת רשימת ספרים מתאימים ונושא ורמה

        [HttpGet("GetAvailableStoriesForChild/{childID}/{topic}")]
        public async Task<IActionResult> GetAvailableStoriesForChild(string childID, string topic)
        {
            var stories = await _storyDBservices.GetAvailableStoriesForChildAsync(childID, topic);

            // תמיד מחזירים רשימה – גם אם ריקה
            return Ok(stories ?? new List<Story>());
        }



        // API לקבלת רשימת ספרים שהילד קרא
        [HttpGet("GetBooksReadByChild/{childID}")]
        public async Task<ActionResult<List<Story>>> GetBooksReadByChild(string childID)
        {
            // קריאה לשכבת השירות
            var booksRead = await _storyDBservices.GetBooksReadByChildAsync(childID);

            // בדיקה אם נמצא משהו
            if (booksRead == null)
            {
                return NotFound($"No books found for child ID {childID}.");
            }
            else if (booksRead.Count == 0)
            {
                return Ok(booksRead);
            }

            // החזרת הסיפורים המלאים
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
