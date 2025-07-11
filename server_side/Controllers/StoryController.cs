using CloudinaryDotNet.Actions; // Keep if you're using Cloudinary elsewhere, otherwise can be removed.
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration; // Ensure this is present
using Server_Side.BL;
using Server_Side.DAL;
using Server_Side.Models;
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
        private readonly string _geminiApiKey; // Declare as private readonly

        public StoryController(StoryDBservices storyDBservices, IConfiguration config, IHttpClientFactory httpClientFactory)
        {
            _storyDBservices = storyDBservices;
            _config = config;
            _httpClientFactory = httpClientFactory;
            // Retrieve API key once in the constructor
            _geminiApiKey = _config["GeminiApiKey"];
            if (string.IsNullOrEmpty(_geminiApiKey))
            {
                // This will stop the application startup if the key is missing
                throw new ApplicationException("Gemini API Key is not configured. Please add 'GeminiApiKey' to your appsettings.json or environment variables.");
            }
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
        //[HttpPost("generate")]
        //public async Task<IActionResult> GenerateStory([FromBody] StoryRequest request)
        //{
        //    if (string.IsNullOrWhiteSpace(request.Topic))
        //    {
        //        return BadRequest("Missing topic.");
        //    }

        //    var storyResponse = new StoryResponse
        //    {
        //        StoryParagraph = new List<StoryParagraph>()
        //    };

        //    var client = _httpClientFactory.CreateClient(); // Get HttpClient from factory

        //    try
        //    {
        //        // STEP 1: Generate the full story text including title and paragraphs,
        //        // and for each paragraph, ask for an image prompt.
        //        // We'll use a single text API call to get structured text.

        //        string combinedStoryPrompt = $@"צור סיפור ילדים מנוקד בעברית על הנושא: ""{request.Topic}"".
        //                                        הסיפור צריך להיות בן 4 פסקאות.
        //                                        התחל עם כותרת מנוקדת בשורה נפרדת.
        //                                        אחרי כל פיסקה, הוסף שורה חדשה עם תיאור תמונה קצר באנגלית, שמתחיל במילה ""ImagePrompt:"".
        //                                        לדוגמה:
        //                                        כותרת הסיפור!
        //                                        פיסקה ראשונה.
        //                                        ImagePrompt: A happy child playing in a park.

        //                                        פיסקה שנייה.
        //                                        ImagePrompt: A friendly dog running.

        //                                        פיסקה שלישית.
        //                                        ImagePrompt: A brave knight fighting a dragon.

        //                                        פיסקה רביעית.
        //                                        ImagePrompt: A magical castle.
        //                                        ";

        //        string fullStoryOutput = await CallGeminiTextAPI(client, _geminiApiKey, combinedStoryPrompt, "gemini-2.0-flash");
        //        Console.WriteLine($"Full Story Output from Gemini:\n{fullStoryOutput}");

        //        // STEP 2: Parse the generated text for title, paragraphs, and image prompts
        //        // Split by new line to process line by line
        //        var lines = fullStoryOutput.Split('\n', StringSplitOptions.RemoveEmptyEntries)
        //                                   .Select(l => l.Trim())
        //                                   .Where(l => !string.IsNullOrWhiteSpace(l))
        //                                   .ToList();

        //        // The first line should be the title
        //        if (lines.Any())
        //        {
        //            storyResponse.Title = lines[0];
        //            lines.RemoveAt(0); // Remove title from lines to process
        //        }
        //        else
        //        {
        //            throw new Exception("Gemini returned empty or unparsable story output.");
        //        }

        //        // Process remaining lines in pairs (paragraph + image prompt)
        //        string currentParagraphText = "";
        //        string currentImagePrompt = "";

        //        foreach (var line in lines)
        //        {
        //            if (line.StartsWith("ImagePrompt:", StringComparison.OrdinalIgnoreCase))
        //            {
        //                currentImagePrompt = line.Substring("ImagePrompt:".Length).Trim();
        //                // If we have a paragraph text collected, add it to the list
        //                if (!string.IsNullOrWhiteSpace(currentParagraphText))
        //                {
        //                    storyResponse.StoryParagraph.Add(new StoryParagraph
        //                    {
        //                        Text = currentParagraphText,
        //                        ImagePrompt = currentImagePrompt,
        //                        Image = null // Will be populated in step 3
        //                    });
        //                    currentParagraphText = ""; // Reset for next paragraph
        //                    currentImagePrompt = ""; // Reset for next image prompt
        //                }
        //            }
        //            else
        //            {
        //                // Accumulate paragraph text. If the previous line was an ImagePrompt,
        //                // this starts a new paragraph. Otherwise, it's a continuation of the current.
        //                if (!string.IsNullOrWhiteSpace(currentParagraphText))
        //                {
        //                    currentParagraphText += "\n" + line; // Append to existing paragraph
        //                }
        //                else
        //                {
        //                    currentParagraphText = line; // Start new paragraph
        //                }
        //            }
        //        }
        //        // Handle the last paragraph if it doesn't end with an ImagePrompt line
        //        if (!string.IsNullOrWhiteSpace(currentParagraphText))
        //        {
        //            storyResponse.StoryParagraph.Add(new StoryParagraph
        //            {
        //                Text = currentParagraphText,
        //                ImagePrompt = currentImagePrompt, // This might be empty if the last line wasn't an ImagePrompt
        //                Image = null
        //            });
        //        }


        //        // STEP 3: Generate images for each paragraph
        //        foreach (var paragraph in storyResponse.StoryParagraph)
        //        {
        //            if (!string.IsNullOrWhiteSpace(paragraph.ImagePrompt))
        //            {
        //                try
        //                {
        //                    // CallGeminiImageAPI will return a single base64 string
        //                    paragraph.Image = await CallGeminiImageAPI(client, _geminiApiKey, paragraph.ImagePrompt);
        //                    Console.WriteLine($"Generated image for prompt: '{paragraph.ImagePrompt.Substring(0, Math.Min(paragraph.ImagePrompt.Length, 50))}...'");
        //                }
        //                catch (Exception ex)
        //                {
        //                    Console.Error.WriteLine($"Error generating image for prompt '{paragraph.ImagePrompt}': {ex.Message}");
        //                    // Image will remain null, or you could set a default "image not available" placeholder
        //                    paragraph.Image = null;
        //                }
        //            }
        //            else
        //            {
        //                Console.WriteLine($"No image prompt available for paragraph: {paragraph.Text.Substring(0, Math.Min(paragraph.Text.Length, 50))}...");
        //            }
        //        }

        //        return Ok(storyResponse);
        //    }
        //    catch (HttpRequestException httpEx)
        //    {
        //        // Catch specific HTTP API errors
        //        Console.Error.WriteLine($"API Request Error: {httpEx.Message}");
        //        return StatusCode(500, $"API communication error: {httpEx.Message}");
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.Error.WriteLine($"An unexpected error occurred during story generation: {ex.Message}");
        //        Console.Error.WriteLine(ex.ToString()); // Log full stack trace
        //        return StatusCode(500, $"An error occurred during story generation: {ex.Message}");
        //    }
        //}

        //// --- Helper Methods for Gemini API Calls ---

        //// Modified CallGeminiTextAPI: Consolidated and added optional modelId
        //private async Task<string> CallGeminiTextAPI(HttpClient client, string apiKey, string prompt, string modelId = "gemini-2.0-flash")
        //{
        //    var body = new
        //    {
        //        contents = new[]
        //        {
        //            new {
        //                role = "user",
        //                parts = new[] {
        //                    new { text = prompt }
        //                }
        //            }
        //        }
        //    };

        //    var json = JsonSerializer.Serialize(body);
        //    var requestContent = new StringContent(json, Encoding.UTF8, "application/json");

        //    Console.WriteLine($"--- Sending Request to Gemini Text API ({modelId}) ---");
        //    Console.WriteLine($"URL: https://generativelanguage.googleapis.com/v1beta/models/{modelId}:generateContent?key={apiKey}");
        //    Console.WriteLine($"Request Body: {json}");
        //    Console.WriteLine("--------------------------------------------------");

        //    var response = await client.PostAsync(
        //        $"https://generativelanguage.googleapis.com/v1beta/models/{modelId}:generateContent?key={apiKey}",
        //        requestContent
        //    );

        //    var content = await response.Content.ReadAsStringAsync();

        //    Console.WriteLine($"--- Gemini Text API Response Status Code ({modelId}) ---");
        //    Console.WriteLine($"Status: {(int)response.StatusCode} {response.ReasonPhrase}");
        //    Console.WriteLine($"--- Gemini Text API Raw Response Content ({modelId}) ---");
        //    Console.WriteLine(content);
        //    Console.WriteLine("--------------------------------------------------");

        //    if (!response.IsSuccessStatusCode)
        //    {
        //        try
        //        {
        //            using var errorDoc = JsonDocument.Parse(content);
        //            if (errorDoc.RootElement.TryGetProperty("error", out var errorElement))
        //            {
        //                var errorMessage = errorElement.TryGetProperty("message", out var messageProp) ? messageProp.GetString() : "Unknown API Error";
        //                var errorCode = errorElement.TryGetProperty("code", out var codeProp) ? codeProp.GetInt32() : -1;
        //                var errorStatus = errorElement.TryGetProperty("status", out var statusProp) ? statusProp.GetString() : "UNKNOWN";
        //                throw new HttpRequestException(
        //                    $"Gemini Text API call failed with HTTP status {(int)response.StatusCode} ({response.ReasonPhrase}). " +
        //                    $"API Error Code: {errorCode}, Status: {errorStatus}, Message: {errorMessage}. " +
        //                    $"Full response: {content}"
        //                );
        //            }
        //        }
        //        catch (JsonException)
        //        {
        //            throw new HttpRequestException(
        //                $"Gemini Text API call failed with HTTP status {(int)response.StatusCode} ({response.ReasonPhrase}). " +
        //                $"Non-JSON or unexpected error response body: {content}"
        //            );
        //        }
        //        throw new HttpRequestException(
        //            $"Gemini Text API call failed with HTTP status {(int)response.StatusCode} ({response.ReasonPhrase}). " +
        //            $"Raw response: {content}"
        //        );
        //    }

        //    using var doc = JsonDocument.Parse(content);
        //    try
        //    {
        //        return doc.RootElement
        //            .GetProperty("candidates")[0]
        //            .GetProperty("content")
        //            .GetProperty("parts")[0]
        //            .GetProperty("text")
        //            .GetString();
        //    }
        //    catch (KeyNotFoundException ex)
        //    {
        //        Console.Error.WriteLine($"JSON Parsing Error (KeyNotFound) for model {modelId}: A required property was not found in the Gemini Text API response. This indicates an unexpected response structure. Raw response: {content}");
        //        throw new Exception($"Failed to parse Gemini Text API response for model {modelId}: Missing expected JSON property. See console for raw API response.", ex);
        //    }
        //    catch (IndexOutOfRangeException ex)
        //    {
        //        Console.Error.WriteLine($"JSON Parsing Error (IndexOutOfRange) for model {modelId}: An array index was out of bounds (e.g., 'candidates' or 'parts' was empty) in the Gemini Text API response. Raw response: {content}");
        //        throw new Exception($"Failed to parse Gemini Text API response for model {modelId}: Empty array encountered. See console for raw API response.", ex);
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.Error.WriteLine($"An unexpected JSON parsing error occurred in Gemini Text API response for model {modelId}: {ex.Message}. Raw response: {content}");
        //        throw new Exception($"An unexpected error occurred during Gemini Text API response parsing for model {modelId}. See console for raw API response.", ex);
        //    }
        //}

        //// Refined CallGeminiImageAPI: Returns a single base64 string
        //private async Task<string> CallGeminiImageAPI(HttpClient client, string apiKey, string prompt)
        //{
        //    var body = new
        //    {
        //        contents = new[]
        //        {
        //    new {
        //        role = "user",
        //        parts = new[] {
        //            new { text = prompt }
        //        }
        //    }
        //},
        //        generationConfig = new
        //        {
        //            responseModalities = new[] { "TEXT", "IMAGE" },
        //            candidateCount = 1 // Keep candidateCount as it's a standard parameter for number of candidates
        //        }
        //    };

        //    var json = JsonSerializer.Serialize(body);
        //    var requestContent = new StringContent(json, Encoding.UTF8, "application/json");

        //    const string imageModelId = "gemini-2.0-flash-preview-image-generation"; // The specific model for images
        //    Console.WriteLine($"--- Sending Request to Gemini Image API ({imageModelId}) ---");
        //    Console.WriteLine($"URL: https://generativelanguage.googleapis.com/v1beta/models/{imageModelId}:generateContent?key={apiKey}");
        //    Console.WriteLine($"Request Body: {json}");
        //    Console.WriteLine("---------------------------------------------------------");

        //    var response = await client.PostAsync(
        //        $"https://generativelanguage.googleapis.com/v1beta/models/{imageModelId}:generateContent?key={apiKey}",
        //        requestContent
        //    );

        //    var content = await response.Content.ReadAsStringAsync();

        //    Console.WriteLine($"--- Gemini Image API Response Status Code ({imageModelId}) ---");
        //    Console.WriteLine($"Status: {(int)response.StatusCode} {response.ReasonPhrase}");
        //    Console.WriteLine($"--- Gemini Image API Raw Response Content ({imageModelId}) ---");
        //    Console.WriteLine(content);
        //    Console.WriteLine("---------------------------------------------------------");

        //    if (!response.IsSuccessStatusCode)
        //    {
        //        try
        //        {
        //            using var errorDoc = JsonDocument.Parse(content);
        //            if (errorDoc.RootElement.TryGetProperty("error", out var errorElement))
        //            {
        //                var errorMessage = errorElement.TryGetProperty("message", out var messageProp) ? messageProp.GetString() : "Unknown API Error";
        //                var errorCode = errorElement.TryGetProperty("code", out var codeProp) ? codeProp.GetInt32() : -1;
        //                var errorStatus = errorElement.TryGetProperty("status", out var statusProp) ? statusProp.GetString() : "UNKNOWN";
        //                throw new HttpRequestException(
        //                    $"Gemini Image API call failed with HTTP status {(int)response.StatusCode} ({response.ReasonPhrase}). " +
        //                    $"API Error Code: {errorCode}, Status: {errorStatus}, Message: {errorMessage}. " +
        //                    $"Full response: {content}"
        //                );
        //            }
        //        }
        //        catch (JsonException)
        //        {
        //            throw new HttpRequestException(
        //                $"Gemini Image API call failed with HTTP status {(int)response.StatusCode} ({response.ReasonPhrase}). " +
        //                $"Non-JSON or unexpected error response body: {content}"
        //            );
        //        }
        //        throw new HttpRequestException(
        //            $"Gemini Image API call failed with HTTP status {(int)response.StatusCode} ({response.ReasonPhrase}). " +
        //            $"Raw response: {content}"
        //        );
        //    }

        //    using var doc = JsonDocument.Parse(content);
        //    try
        //    {
        //        // Check if 'candidates' exists and is not empty
        //        if (!doc.RootElement.TryGetProperty("candidates", out var candidates) || candidates.GetArrayLength() == 0)
        //        {
        //            Console.WriteLine("Warning: Gemini Image API response was successful, but no 'candidates' found. Full response: " + content);
        //            return null;
        //        }

        //        // Get the first candidate
        //        var firstCandidate = candidates[0];

        //        // Check if 'content' and 'parts' exist
        //        if (!firstCandidate.TryGetProperty("content", out var contentElement) ||
        //            !contentElement.TryGetProperty("parts", out var partsElement))
        //        {
        //            Console.WriteLine("Warning: Gemini Image API response was successful, but 'content' or 'parts' missing from candidate. Full response: " + content);
        //            return null;
        //        }

        //        // Iterate parts to find the inlineData (image)
        //        foreach (var part in partsElement.EnumerateArray())
        //        {
        //            if (part.TryGetProperty("inlineData", out var inlineData) &&
        //                inlineData.TryGetProperty("mimeType", out var mimeType) &&
        //                mimeType.GetString().StartsWith("image/") && // Still good to check mimeType to ensure it's an image
        //                inlineData.TryGetProperty("data", out var base64Data))
        //            {
        //                return base64Data.GetString(); // Return the base64 string of the image
        //            }
        //        }

        //        Console.WriteLine("Warning: Gemini Image API response was successful, but no image 'inlineData.data' found within parts. Full response: " + content);
        //        return null; // No image data found in the expected format
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.Error.WriteLine($"JSON parsing error (Gemini Flash Image Gen): {ex.Message}. Full response: {content}");
        //        throw new Exception("Failed to parse Gemini Flash Image Generation API response. Check console for full response.", ex);
        //    }
        //}

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