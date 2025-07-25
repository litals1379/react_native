using CloudinaryDotNet.Actions; // Keep if you're using Cloudinary elsewhere, otherwise can be removed.
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration; // Keep if used for other config, but GeminiApiKey will be removed
using MongoDB.Bson;
using Server_Side.BL;
using Server_Side.DAL;
using Server_Side.Models;
using Server_Side.Services; // Essential for GoogleAIService
using System; // Required for Math.Min, ApplicationException
using System.Collections.Generic; // Required for List
using System.Linq; // Required for .First(), .Skip(), .Where(), .Any(), .ElementAtOrDefault()
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging; // Add this for logging

namespace Server_Side.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StoryController : ControllerBase
    {
        private readonly StoryDBservices _storyDBservices;
        private readonly ReadingPromptService _promptService;
        private readonly CloudinaryService _cloudinaryService;
        private readonly GoogleAIService _googleAIService; // Inject GoogleAIService
        private readonly ILogger<StoryController> _logger; // Inject Logger

        // Constructor - UPDATED to use GoogleAIService and ILogger
        public StoryController(
            StoryDBservices storyDBservices,
            ReadingPromptService promptService,
            CloudinaryService cloudinaryService,
            GoogleAIService googleAIService, // Add GoogleAIService
            ILogger<StoryController> logger) // Add ILogger
        {
            _storyDBservices = storyDBservices;
            _promptService = promptService;
            _cloudinaryService = cloudinaryService;
            _googleAIService = googleAIService; // Assign injected service
            _logger = logger; // Assign logger
        }

        // Existing API endpoints (keep them as they are)
        [HttpGet("GetStoryForChild/{childID}/{topic}")]
        public async Task<IActionResult> GetStoryForChild(string childID, string topic)
        {
            var story = await _storyDBservices.GetStoryForChildAsync(childID, topic);
            if (story == null)
            {
                _logger.LogWarning($"No story found for child {childID} with topic '{topic}'.");
                return NotFound($"No story found for child {childID} with topic '{topic}'.");
            }
            return Ok(story);
        }

        [HttpGet("GetAvailableStoriesForChild/{childID}/{topic}")]
        public async Task<IActionResult> GetAvailableStoriesForChild(string childID, string topic)
        {
            var stories = await _storyDBservices.GetAvailableStoriesForChildAsync(childID, topic);
            return Ok(stories ?? new List<Story>());
        }

        [HttpGet("GetBooksReadByChild/{childID}")]
        public async Task<ActionResult<List<Story>>> GetBooksReadByChild(string childID)
        {
            var booksRead = await _storyDBservices.GetBooksReadByChildAsync(childID);
            return Ok(booksRead ?? new List<Story>());
        }

        [HttpGet("GetStoryById/{storyId}")]
        public async Task<IActionResult> GetStoryById(string storyId)
        {
            var story = await _storyDBservices.GetStoryByIdAsync(storyId);
            if (story == null)
            {
                _logger.LogWarning($"No story found with ID: {storyId}.");
                return NotFound($"No story found with ID: {storyId}.");
            }
            return Ok(story);
        }

        // --- Story Generation Endpoint - UPDATED to use GoogleAIService ---
        [HttpPost("generate")]
        public async Task<IActionResult> GenerateStory([FromBody] StoryRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Topic))
                return BadRequest("Missing topic.");

            var storyResponse = new StoryResponse
            {
                StoryParagraph = new List<StoryParagraph>()
            };

            try
            {
                // STEP 1: Generate story with title and paragraphs
                string storyPrompt;
                try
                {
                    storyPrompt = _promptService.GetPromptByLevel(request.Level, request.Topic);
                    _logger.LogInformation($"Story generation prompt: {storyPrompt}");
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Invalid level for prompt generation: {request.Level}");
                    return BadRequest($"Invalid level: {ex.Message}");
                }

                string storyOutput = await _googleAIService.GenerateTextWithGeminiAsync(
                    storyPrompt,
                    modelName: "gemini-2.5-flash", //
                    maxOutputTokens: 16384 // Adjust token limit as needed for stories
                );
                _logger.LogInformation($"Generated Story Output (partial):\n{storyOutput.Substring(0, Math.Min(storyOutput.Length, 500))}");


                var blocks = storyOutput.Split(new[] { "\n\n", "\r\n\r\n" }, StringSplitOptions.RemoveEmptyEntries)
                                        .Select(p => p.Trim())
                                        .Where(p => !string.IsNullOrWhiteSpace(p))
                                        .ToList();

                if (blocks.Count < 2)
                {
                    _logger.LogError($"Failed to parse story output. Expected at least 2 blocks (title + paragraph). Raw output: {storyOutput}");
                    return StatusCode(500, "Failed to parse story output. The AI might not have generated a title and paragraphs correctly.");
                }

                var rawTitle = blocks[0];
                storyResponse.Title = Regex.Replace(rawTitle, @"^[\s#*]+|[\s#*]+$", "").Trim();

                blocks.RemoveAt(0); // Remove title

                foreach (var paragraph in blocks)
                {
                    var cleanedText = Regex.Replace(paragraph, @"[\\/*]", "").Trim();

                    storyResponse.StoryParagraph.Add(new StoryParagraph
                    {
                        Text = cleanedText,
                        ImagePrompt = null, // Will be set later
                        Image = null        // Will be set later
                    });
                }

                // STEP 2: Generate image prompts
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

                // Use GoogleAIService for image prompt generation (text model)
                string imagePromptOutput = await _googleAIService.GenerateTextWithGeminiAsync(imagePromptRequest, modelName: "gemini-2.5-flash");
                _logger.LogInformation($"Generated Image Prompts Output (partial):\n{imagePromptOutput.Substring(0, Math.Min(imagePromptOutput.Length, 500))}");

                var imagePrompts = Regex.Split(imagePromptOutput, @"(?=Use 3D animation)")
                                        .Where(p => !string.IsNullOrWhiteSpace(p))
                                        .Select(p => p.Trim())
                                        .ToList();

                // STEP 3: Attach prompts and generate images
                for (int i = 0; i < storyResponse.StoryParagraph.Count; i++)
                {
                    var para = storyResponse.StoryParagraph[i];
                    para.ImagePrompt = imagePrompts.ElementAtOrDefault(i); // Use ElementAtOrDefault to prevent index out of bounds

                    if (string.IsNullOrEmpty(para.ImagePrompt))
                    {
                        _logger.LogWarning($"No image prompt generated for paragraph {i + 1}. Skipping image generation for this paragraph.");
                        para.Image = null; // Ensure image is null if prompt is missing
                        continue;
                    }

                    int maxRetries = 3;

                    for (int attempt = 0; attempt < maxRetries; attempt++)
                    {
                        try
                        {
                            // Use GoogleAIService for image generation (Imagen 3.0)
                            var generatedImages = await _googleAIService.GenerateImageWithImagen3Async(
                                para.ImagePrompt,
                                sampleCount: 1,
                                aspectRatio: "16:9"
                            );

                            if (generatedImages != null && generatedImages.Length > 0)
                            {
                                para.Image = generatedImages[0];
                                _logger.LogInformation($"Image generated for paragraph {i + 1}. Prompt: {para.ImagePrompt.Substring(0, Math.Min(50, para.ImagePrompt.Length))}...");
                                break; // success
                            }
                            else
                            {
                                _logger.LogWarning($"Imagen 3.0 did not return an image for prompt: {para.ImagePrompt.Substring(0, Math.Min(50, para.ImagePrompt.Length))}...");
                                para.Image = null;
                                break; // exit if no image but no error
                            }
                        }
                        catch (HttpRequestException ex) when ((int?)ex.StatusCode == 429)
                        {
                            int delayMs = (int)Math.Pow(2, attempt + 1) * 1000;
                            _logger.LogWarning($"429 Too Many Requests on image prompt {i + 1}. Retrying in {delayMs}ms. Attempt {attempt + 1}/{maxRetries}.");
                            await Task.Delay(delayMs);
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError(ex, $"Error generating image for prompt '{para.ImagePrompt.Substring(0, Math.Min(50, para.ImagePrompt.Length))}...': {ex.Message}");
                            para.Image = null;
                            break;
                        }
                    }
                }

                // STEP 4: Upload images and save story
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

                    if (!string.IsNullOrEmpty(para.Image)) // This 'para.Image' is the base64 string
                    {
                        string imageUrl = await _cloudinaryService.UploadBase64ImageAsync(para.Image, $"image_{i}", cloudinaryFolder);
                        imagesUrls[imgKey] = imageUrl;

                        if (coverImg == null) // Use first available image as cover
                            coverImg = imageUrl;
                    }
                }

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

                await _storyDBservices.InsertStoryAsync(finalStory);
                _logger.LogInformation($"Story '{finalStory.Title}' (ID: {storyId}) generated and saved successfully.");
                return Ok(finalStory);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Unexpected error during story generation: {ex.Message}");
                return StatusCode(500, $"An error occurred during story generation: {ex.Message}");
            }
        }


        // Remove the old CallGeminiTextAPI and CallGeminiImageAPI helper methods
        // The GoogleAIService now handles these calls with proper authentication

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
                _logger.LogWarning($"Story with ID {storyId} not found for rating.");
                return NotFound($"Story with ID {storyId} not found.");
            }

            _logger.LogInformation($"Story '{storyId}' rated {rating} successfully.");
            return Ok("Rating submitted successfully.");
        }
    }
}