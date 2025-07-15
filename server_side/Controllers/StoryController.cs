using CloudinaryDotNet.Actions; // Keep if you're using Cloudinary elsewhere, otherwise can be removed.
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration; // Ensure this is present
using MongoDB.Bson;
using Server_Side.BL;
using Server_Side.DAL;
using Server_Side.Models;
using Server_Side.Services;
using System; // Required for Math.Min, ApplicationException
using System.Collections.Generic; // Required for List
using System.Linq; // Required for .First(), .Skip(), .Where(), .Any(), .ElementAtOrDefault()
using System.Net.Http;
using System.Text;
using System.Text.Json;
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
        private readonly string _geminiApiKey;
        private readonly ReadingPromptService _promptService;
        private readonly CloudinaryService _cloudinaryService;

        public StoryController(StoryDBservices storyDBservices, IConfiguration config, IHttpClientFactory httpClientFactory, ReadingPromptService promptService, CloudinaryService cloudinaryService)
        {
            _storyDBservices = storyDBservices;
            _config = config;
            _httpClientFactory = httpClientFactory;
            _cloudinaryService = cloudinaryService;
            // Retrieve API key once in the constructor
            _geminiApiKey = _config["GeminiApiKey"];
            if (string.IsNullOrEmpty(_geminiApiKey))
            {
                // This will stop the application startup if the key is missing
                throw new ApplicationException("Gemini API Key is not configured. Please add 'GeminiApiKey' to your appsettings.json or environment variables.");
            }

            _promptService = promptService;
        }

        // Existing API endpoints (keep them as they are)
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

        [HttpGet("GetAvailableStoriesForChild/{childID}/{topic}")]
        public async Task<IActionResult> GetAvailableStoriesForChild(string childID, string topic)
        {
            var stories = await _storyDBservices.GetAvailableStoriesForChildAsync(childID, topic);
            return Ok(stories ?? new List<Story>()); // Always return a list, even if empty
        }

        [HttpGet("GetBooksReadByChild/{childID}")]
        public async Task<ActionResult<List<Story>>> GetBooksReadByChild(string childID)
        {
            var booksRead = await _storyDBservices.GetBooksReadByChildAsync(childID);
            return Ok(booksRead ?? new List<Story>()); // Always return a list, even if empty
        }

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

        // --- New/Updated Story Generation Endpoint ---
        [HttpPost("generate")]
        public async Task<IActionResult> GenerateStory([FromBody] StoryRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Topic))
                return BadRequest("Missing topic.");

            var client = _httpClientFactory.CreateClient();
            var storyResponse = new StoryResponse
            {
                StoryParagraph = new List<StoryParagraph>()
            };

            try
            {
                // STEP 1: Generate the story with title and 4 paragraphs
                //                string storyPrompt = $@"צור סיפור ילדים מנוקד בעברית בנושא ""{request.Topic}"".
                //הסיפור צריך להיות בן 4 פסקאות, כל אחת בת שני משפטים לפחות.
                //התחל עם כותרת מנוקדת בשורה נפרדת.
                //הפרד בין כל פסקה באמצעות שורה ריקה.";
                string storyPrompt;
                try
                {
                    storyPrompt = _promptService.GetPromptByLevel(request.Level, request.Topic);
                    Console.WriteLine($"{storyPrompt}");
                }
                catch (Exception ex)
                {
                    return BadRequest($"Invalid level: {ex.Message}");
                }

                string storyOutput = await CallGeminiTextAPI(client, _geminiApiKey, storyPrompt);
                Console.WriteLine($"Generated Story:\n{storyOutput}");

                // Split output into title and paragraphs
                var blocks = storyOutput.Split(new[] { "\n\n", "\r\n\r\n" }, StringSplitOptions.RemoveEmptyEntries)
                                        .Select(p => p.Trim())
                                        .Where(p => !string.IsNullOrWhiteSpace(p))
                                        .ToList();

                if (blocks.Count < 2)
                    return StatusCode(500, "Failed to parse story output.");

                storyResponse.Title = blocks[0];
                blocks.RemoveAt(0); // Remove title

                foreach (var paragraph in blocks)
                {
                    storyResponse.StoryParagraph.Add(new StoryParagraph
                    {
                        Text = paragraph,
                        ImagePrompt = null,
                        Image = null
                    });
                }

                // STEP 2: Generate image prompts using template-based prompt
                string paragraphBlock = string.Join("\n\n", storyResponse.StoryParagraph.Select(p => p.Text));

                string imagePromptRequest = $@"{paragraphBlock}
For the story you just wrote please generate detailed descriptions of each character including age, hair color, length, and style, eye color, skin color, clothing, and any outstanding physical characteristics. If there are any recurring subjects or settings in the story, please describe these in detail as well.

I'm going to use your script for a story, and I need images to go along with the text. Please write image prompts with the following rules:

Always use the prompt template!

Create exactly 1 image prompt per paragraph of the story. Each image should reflect the paragraph’s content and mood.

Characters must be consistently described *in each* image prompt.

Scene consistency (setting/time/mood) is very important.

Use varied angles when describing the camera.

Here is the prompt template:
Use 3D animation and a 16:9 aspect ratio to create [subject], a [age]-year-old with [hair color and style], [eye color] eyes, and [skin tone] skin, wearing [brief but clear clothing description]. In [setting/background description], [subject] is [placement in frame] and is [describe subject's action]. The POV is [camera angle, focal length, aperture] at [time of day and/or lighting description]. The mood is [emotional tone or atmosphere] in this scene.

👉 Return only the image prompts in this exact template. No summaries, no explanations.";

                string imagePromptOutput = await CallGeminiTextAPI(client, _geminiApiKey, imagePromptRequest);
                Console.WriteLine($"Generated Image Prompts:\n{imagePromptOutput}");

                var imagePrompts = Regex.Split(imagePromptOutput, @"(?=Use 3D animation)")
                                        .Where(p => !string.IsNullOrWhiteSpace(p))
                                        .Select(p => p.Trim())
                                        .ToList();

                // STEP 3: Attach prompts and generate images
                for (int i = 0; i < storyResponse.StoryParagraph.Count && i < imagePrompts.Count; i++)
                {
                    var para = storyResponse.StoryParagraph[i];
                    para.ImagePrompt = imagePrompts[i];

                    try
                    {
                        para.Image = await CallGeminiImageAPI(client, _geminiApiKey, para.ImagePrompt);
                        Console.WriteLine($"Image generated for prompt: {para.ImagePrompt.Substring(0, Math.Min(50, para.ImagePrompt.Length))}...");
                    }
                    catch (Exception ex)
                    {
                        Console.Error.WriteLine($"Error generating image for prompt '{para.ImagePrompt}': {ex.Message}");
                        para.Image = null;
                    }
                }

                // Generate a unique ID for the story before saving
                var storyId = ObjectId.GenerateNewId().ToString();
                string cloudinaryFolder = $"Story Time/{storyId}";

                var paragraphs = new Dictionary<string, string>();
                var imagesUrls = new Dictionary<string, string>();
                string coverImg = null;

                for (int i = 0; i < storyResponse.StoryParagraph.Count; i++)
                {
                    var para = storyResponse.StoryParagraph[i];
                    string paraKey = $"para{i}";
                    string imgKey = $"img{i}";

                    paragraphs[paraKey] = para.Text;

                    if (!string.IsNullOrEmpty(para.Image))
                    {
                        string imageUrl = await _cloudinaryService.UploadBase64ImageAsync(para.Image, $"image_{i}", cloudinaryFolder);
                        imagesUrls[imgKey] = imageUrl;

                        if (i == 0) // use first image as cover
                            coverImg = imageUrl;
                    }
                }

                // Create Story object for DB
                var finalStory = new Story
                {
                    Id = storyId,
                    Title = storyResponse.Title,
                    CoverImg = coverImg,
                    Topic = request.Topic,
                    Paragraphs = paragraphs,
                    ImagesUrls = imagesUrls,
                    ReadingLevel = request.Level,
                    Ratings = new List<int>(),
                    AverageRating = 0.0
                };

                // Save to DB
                await _storyDBservices.InsertStoryAsync(finalStory);

                return Ok(finalStory);


                //return Ok(storyResponse);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Unexpected error during story generation: {ex.Message}");
                return StatusCode(500, $"An error occurred during story generation: {ex.Message}");
            }
        }

        // --- Helper Methods for Gemini API Calls ---

        // Modified CallGeminiTextAPI: Consolidated and added optional modelId
        private async Task<string> CallGeminiTextAPI(HttpClient client, string apiKey, string prompt, string modelId = "gemini-2.0-flash")
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
                },
                generationConfig = new
                {
                    temperature = 0.7,            // Controls creativity (0.0–1.0)
                    topK = 40,                    // Limits token sampling to top K options (optional)
                    topP = 0.95,                   // Nucleus sampling (optional)
                    maxOutputTokens = 2048         // Max output token limit (adjust as needed)
                }
            };


            var json = JsonSerializer.Serialize(body);
            var requestContent = new StringContent(json, Encoding.UTF8, "application/json");

            Console.WriteLine($"--- Sending Request to Gemini Text API ({modelId}) ---");
            Console.WriteLine($"URL: https://generativelanguage.googleapis.com/v1beta/models/{modelId}:generateContent?key={apiKey}");
            Console.WriteLine($"Request Body: {json}");
            Console.WriteLine("--------------------------------------------------");

            var response = await client.PostAsync(
                $"https://generativelanguage.googleapis.com/v1beta/models/{modelId}:generateContent?key={apiKey}",
                requestContent
            );

            var content = await response.Content.ReadAsStringAsync();

            Console.WriteLine($"--- Gemini Text API Response Status Code ({modelId}) ---");
            Console.WriteLine($"Status: {(int)response.StatusCode} {response.ReasonPhrase}");
            Console.WriteLine($"--- Gemini Text API Raw Response Content ({modelId}) ---");
            Console.WriteLine(content);
            Console.WriteLine("--------------------------------------------------");

            if (!response.IsSuccessStatusCode)
            {
                try
                {
                    using var errorDoc = JsonDocument.Parse(content);
                    if (errorDoc.RootElement.TryGetProperty("error", out var errorElement))
                    {
                        var errorMessage = errorElement.TryGetProperty("message", out var messageProp) ? messageProp.GetString() : "Unknown API Error";
                        var errorCode = errorElement.TryGetProperty("code", out var codeProp) ? codeProp.GetInt32() : -1;
                        var errorStatus = errorElement.TryGetProperty("status", out var statusProp) ? statusProp.GetString() : "UNKNOWN";
                        throw new HttpRequestException(
                            $"Gemini Text API call failed with HTTP status {(int)response.StatusCode} ({response.ReasonPhrase}). " +
                            $"API Error Code: {errorCode}, Status: {errorStatus}, Message: {errorMessage}. " +
                            $"Full response: {content}"
                        );
                    }
                }
                catch (JsonException)
                {
                    throw new HttpRequestException(
                        $"Gemini Text API call failed with HTTP status {(int)response.StatusCode} ({response.ReasonPhrase}). " +
                        $"Non-JSON or unexpected error response body: {content}"
                    );
                }
                throw new HttpRequestException(
                    $"Gemini Text API call failed with HTTP status {(int)response.StatusCode} ({response.ReasonPhrase}). " +
                    $"Raw response: {content}"
                );
            }

            using var doc = JsonDocument.Parse(content);
            try
            {
                return doc.RootElement
                    .GetProperty("candidates")[0]
                    .GetProperty("content")
                    .GetProperty("parts")[0]
                    .GetProperty("text")
                    .GetString();
            }
            catch (KeyNotFoundException ex)
            {
                Console.Error.WriteLine($"JSON Parsing Error (KeyNotFound) for model {modelId}: A required property was not found in the Gemini Text API response. This indicates an unexpected response structure. Raw response: {content}");
                throw new Exception($"Failed to parse Gemini Text API response for model {modelId}: Missing expected JSON property. See console for raw API response.", ex);
            }
            catch (IndexOutOfRangeException ex)
            {
                Console.Error.WriteLine($"JSON Parsing Error (IndexOutOfRange) for model {modelId}: An array index was out of bounds (e.g., 'candidates' or 'parts' was empty) in the Gemini Text API response. Raw response: {content}");
                throw new Exception($"Failed to parse Gemini Text API response for model {modelId}: Empty array encountered. See console for raw API response.", ex);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"An unexpected JSON parsing error occurred in Gemini Text API response for model {modelId}: {ex.Message}. Raw response: {content}");
                throw new Exception($"An unexpected error occurred during Gemini Text API response parsing for model {modelId}. See console for raw API response.", ex);
            }
        }

        // Refined CallGeminiImageAPI: Returns a single base64 string
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
        },
                generationConfig = new
                {
                    responseModalities = new[] { "TEXT", "IMAGE" },
                    candidateCount = 1 // Keep candidateCount as it's a standard parameter for number of candidates
                }
            };

            var json = JsonSerializer.Serialize(body);
            var requestContent = new StringContent(json, Encoding.UTF8, "application/json");

            const string imageModelId = "gemini-2.0-flash-preview-image-generation"; // The specific model for images
            Console.WriteLine($"--- Sending Request to Gemini Image API ({imageModelId}) ---");
            Console.WriteLine($"URL: https://generativelanguage.googleapis.com/v1beta/models/{imageModelId}:generateContent?key={apiKey}");
            Console.WriteLine($"Request Body: {json}");
            Console.WriteLine("---------------------------------------------------------");

            var response = await client.PostAsync(
                $"https://generativelanguage.googleapis.com/v1beta/models/{imageModelId}:generateContent?key={apiKey}",
                requestContent
            );

            var content = await response.Content.ReadAsStringAsync();

            Console.WriteLine($"--- Gemini Image API Response Status Code ({imageModelId}) ---");
            Console.WriteLine($"Status: {(int)response.StatusCode} {response.ReasonPhrase}");
            Console.WriteLine($"--- Gemini Image API Raw Response Content ({imageModelId}) ---");
            Console.WriteLine(content);
            Console.WriteLine("---------------------------------------------------------");

            if (!response.IsSuccessStatusCode)
            {
                try
                {
                    using var errorDoc = JsonDocument.Parse(content);
                    if (errorDoc.RootElement.TryGetProperty("error", out var errorElement))
                    {
                        var errorMessage = errorElement.TryGetProperty("message", out var messageProp) ? messageProp.GetString() : "Unknown API Error";
                        var errorCode = errorElement.TryGetProperty("code", out var codeProp) ? codeProp.GetInt32() : -1;
                        var errorStatus = errorElement.TryGetProperty("status", out var statusProp) ? statusProp.GetString() : "UNKNOWN";
                        throw new HttpRequestException(
                            $"Gemini Image API call failed with HTTP status {(int)response.StatusCode} ({response.ReasonPhrase}). " +
                            $"API Error Code: {errorCode}, Status: {errorStatus}, Message: {errorMessage}. " +
                            $"Full response: {content}"
                        );
                    }
                }
                catch (JsonException)
                {
                    throw new HttpRequestException(
                        $"Gemini Image API call failed with HTTP status {(int)response.StatusCode} ({response.ReasonPhrase}). " +
                        $"Non-JSON or unexpected error response body: {content}"
                    );
                }
                throw new HttpRequestException(
                    $"Gemini Image API call failed with HTTP status {(int)response.StatusCode} ({response.ReasonPhrase}). " +
                    $"Raw response: {content}"
                );
            }

            using var doc = JsonDocument.Parse(content);
            try
            {
                // Check if 'candidates' exists and is not empty
                if (!doc.RootElement.TryGetProperty("candidates", out var candidates) || candidates.GetArrayLength() == 0)
                {
                    Console.WriteLine("Warning: Gemini Image API response was successful, but no 'candidates' found. Full response: " + content);
                    return null;
                }

                // Get the first candidate
                var firstCandidate = candidates[0];

                // Check if 'content' and 'parts' exist
                if (!firstCandidate.TryGetProperty("content", out var contentElement) ||
                    !contentElement.TryGetProperty("parts", out var partsElement))
                {
                    Console.WriteLine("Warning: Gemini Image API response was successful, but 'content' or 'parts' missing from candidate. Full response: " + content);
                    return null;
                }

                // Iterate parts to find the inlineData (image)
                foreach (var part in partsElement.EnumerateArray())
                {
                    if (part.TryGetProperty("inlineData", out var inlineData) &&
                        inlineData.TryGetProperty("mimeType", out var mimeType) &&
                        mimeType.GetString().StartsWith("image/") && // Still good to check mimeType to ensure it's an image
                        inlineData.TryGetProperty("data", out var base64Data))
                    {
                        return base64Data.GetString(); // Return the base64 string of the image
                    }
                }

                Console.WriteLine("Warning: Gemini Image API response was successful, but no image 'inlineData.data' found within parts. Full response: " + content);
                return null; // No image data found in the expected format
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"JSON parsing error (Gemini Flash Image Gen): {ex.Message}. Full response: {content}");
                throw new Exception("Failed to parse Gemini Flash Image Generation API response. Check console for full response.", ex);
            }
        }

        [HttpPost("RateStory")]
        public async Task<IActionResult> RateStory([FromQuery] string storyId, [FromQuery] int rating)
        {
            if (string.IsNullOrEmpty(storyId) || rating < 1 || rating > 5)
            {
                return BadRequest("Invalid storyId or rating (must be 1-5).");
            }

            bool success = await _storyDBservices.AddRatingAsync(storyId, rating);
            if (!success)
            {
                return NotFound($"Story with ID {storyId} not found.");
            }

            return Ok("Rating submitted successfully.");
        }

    }
}