using Microsoft.AspNetCore.Mvc;
using Server_Side.BL;
using Server_Side.DAL;
using System;
using System.Collections.Generic;
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

        // Get all stories
        [HttpGet("all")]
        public async Task<IActionResult> GetAllStoriesAsync()
        {
            try
            {
                List<Story> stories = await _storyDBservices.GetAllStoriesAsync();
                if (stories == null || stories.Count == 0)
                {
                    return NotFound(new { message = "No stories found" });
                }
                return Ok(stories);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving stories", error = ex.Message });
            }
        }

        // Add a new story
        [HttpPost("add")]
        public async Task<IActionResult> AddStoryAsync([FromBody] Story story)
        {
            if (story == null || string.IsNullOrWhiteSpace(story.Title) || string.IsNullOrWhiteSpace(story.Topic))
            {
                return BadRequest(new { message = "Invalid story data" });
            }

            bool result = await _storyDBservices.AddStoryAsync(story);
            if (result)
            {
                return Ok(new { message = "Story added successfully" });
            }
            else
            {
                return BadRequest(new { message = "Failed to add the story" });
            }
        }
    }
}
