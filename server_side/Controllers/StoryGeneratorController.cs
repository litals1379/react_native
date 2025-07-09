using Microsoft.AspNetCore.Mvc;
using Server_Side.BL;
using Server_Side.Services;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Server_Side.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StoryGeneratorController : ControllerBase
    {
        private readonly IGeminiService _geminiService;

        public StoryGeneratorController(IGeminiService geminiService)
        {
            _geminiService = geminiService;
        }

        [HttpPost("Generate")]
        public async Task<IActionResult> Generate([FromBody] StoryRequest request)
        {
            try
            {
                var story = await _geminiService.GenerateStoryWithImagesAsync(request.Topic);
                return Ok(story);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}

