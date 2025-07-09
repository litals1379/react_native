using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Mvc;
using Server_Side.BL;
using Server_Side.DAL;
using Server_Side.Models;
using System.Net.Http;
using System.Text.Json;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Server_Side.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StoryController : ControllerBase
    {
        private readonly StoryDBservices _storyDBservices;
        private readonly IConfiguration _config;
        private readonly IHttpClientFactory _httpClientFactory;

        public StoryController(StoryDBservices storyDBservices, IConfiguration config, IHttpClientFactory httpClientFactory)
        {
            _storyDBservices = storyDBservices;
            _config = config;
            _httpClientFactory = httpClientFactory;
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


        [HttpPost("generate")]
        public async Task<IActionResult> GenerateStory([FromBody] StoryRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Topic))
                return BadRequest("Missing topic.");

            var apiKey = _config["GeminiApiKey"];
            if (string.IsNullOrWhiteSpace(apiKey))
                return StatusCode(500, "Missing Gemini API Key");

            var client = _httpClientFactory.CreateClient();

            // STEP 1: Generate story text
            var storyPrompt = $"צור סיפור ילדים מנוקד בעברית של 4 פסקאות בנושא {request.Topic}. התחל בכותרת מנוקדת בשורה נפרדת.";
            var storyText = await CallGeminiTextAPI(client, apiKey, storyPrompt);

            var paragraphsRaw = storyText.Split("\n\n").Where(p => !string.IsNullOrWhiteSpace(p)).ToList();
            var title = paragraphsRaw.First().Trim();
            var paragraphTexts = paragraphsRaw.Skip(1).ToList();

            // STEP 2: Generate image descriptions
            var imageGenPrompt = $@"{storyText}

                For this story let’s generate descriptions for NAME CHARACTERS, SUBJECTS, AND SETTINGS HERE.

                I'm going to use your script for a story, and so I'm going to need images to go along with the text. Please write these image prompts for me with the following guidelines in mind:

                Always use the prompt template!

                Create exactly 1 image prompt to go along with each paragraph of the story max {paragraphTexts.Count} prompts. The image should best represent the content and mood of that paragraph.

                Make sure each image prompt is connected to, and representative of, the corresponding text.

                Consistent characters are key here, so please ensure that the detailed description of each character is always included directly in the image prompt itself, not as separate character descriptions.

                Consistent setting elements are 2nd only to consistent characters. Include setting details directly in the image prompt itself as needed.

                There doesn’t have to be a character in each scene. Switch between characters and other relevant scenes as appropriate.

                Please use a variety of interesting angles (eye-level is fine sometimes, but switch it up to a bird’s eye view, super low ground-level angle, or wide-angle view showing the subject’s full body small in the frame when appropriate).

                Here is the prompt template:
                Use 3D animation and a 16:9 aspect ratio to create [subject] [detailed description of subject] in [setting/background description]. [The subject] is [placement in frame] and is [describe subject's action]. The POV is [describe the camera angle, focal length, and aperture] at [time of day and/or description of lighting]. The mood is [describe mood] in this scene.

                👉 Return only the image prompts in this exact template. Do not include separate character or setting descriptions, explanations, summaries, or any other text beyond the image prompts themselves. Each paragraph should result in exactly one image prompt that best represents it.";

            var promptText = await CallGeminiTextAPI(client, apiKey, imageGenPrompt);
            var imagePrompts = Regex.Split(promptText, @"(?=Use 3D animation)").Where(p => !string.IsNullOrWhiteSpace(p)).ToList();

            // STEP 3: Generate images
            var paragraphData = new List<StoryParagraph>();
            for (int i = 0; i < paragraphTexts.Count; i++)
            {
                var p = new StoryParagraph { Text = paragraphTexts[i], ImagePrompt = imagePrompts.ElementAtOrDefault(i) };

                if (!string.IsNullOrWhiteSpace(p.ImagePrompt))
                {
                    try
                    {
                        p.Image = await CallGeminiImageAPI(client, apiKey, p.ImagePrompt);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Image generation failed for paragraph {i}: {ex.Message}");
                    }
                }

                paragraphData.Add(p);
            }

            return Ok(new StoryResponse
            {
                Title = title,
                StoryParagraph = paragraphData
            });
        }

        private async Task<string> CallGeminiTextAPI(HttpClient client, string apiKey, string prompt)
        {
            var body = new
            {
                contents = new[]
                {
            new {
                role = "user",
                parts = new[] {
                    new { text = prompt }
                }
            }
        }
            };

            var json = JsonSerializer.Serialize(body);
            var response = await client.PostAsync(
                $"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={apiKey}",
                new StringContent(json, Encoding.UTF8, "application/json")
            );

            var content = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(content);
            return doc.RootElement
                .GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString();
        }

        private async Task<string> CallGeminiImageAPI(HttpClient client, string apiKey, string prompt)
        {
            var body = new
            {
                contents = new[]
                {
            new {
                role = "user",
                parts = new[] {
                    new { text = prompt }
                }
            }
        }
            };

            var json = JsonSerializer.Serialize(body);
            var response = await client.PostAsync(
                $"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key={apiKey}",
                new StringContent(json, Encoding.UTF8, "application/json")
            );

            var content = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(content);
            var parts = doc.RootElement
                .GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts");

            foreach (var part in parts.EnumerateArray())
            {
                if (part.TryGetProperty("inlineData", out var data) && data.TryGetProperty("data", out var base64))
                {
                    return base64.GetString();
                }
            }

            return null;
        }


    }

}
