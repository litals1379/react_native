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
    }
}
