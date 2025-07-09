using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.RegularExpressions;
using Microsoft.Extensions.Configuration;
using Server_Side.BL;
using Server_Side.Services;

namespace Server_Side.Services
{
    public class GeminiService : IGeminiService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public GeminiService(IConfiguration config)
        {
            _httpClient = new HttpClient();
            _apiKey = config["Gemini:ApiKey"];
        }

        public async Task<StoryResponse> GenerateStoryWithImagesAsync(string topic)
        {
            var prompt = $"צור סיפור ילדים מנוקד בעברית של 4 פסקאות בנושא {topic}.";
            var storyText = await CallGeminiModel(prompt, "gemini-2.0-flash");

            var paragraphs = storyText.Split("\n\n", StringSplitOptions.RemoveEmptyEntries);
            var imagePrompts = await GenerateImagePrompts(paragraphs);
            var images = await Task.WhenAll(imagePrompts.Select(p => GenerateImage(p)));

            var result = paragraphs.Select((p, i) => new StoryParagraph
            {
                Text = p,
                ImagePrompt = imagePrompts[i],
                ImageBase64 = images[i]
            }).ToList();

            return new StoryResponse { Paragraphs = result };
        }

        private async Task<string> CallGeminiModel(string prompt, string model)
        {
            var requestBody = new
            {
                contents = new[]
                {
                    new
                    {
                        role = "user",
                        parts = new[] { new { text = prompt } }
                    }
                }
            };

            var response = await _httpClient.PostAsJsonAsync(
                $"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={_apiKey}",
                requestBody
            );

            response.EnsureSuccessStatusCode();
            var json = await response.Content.ReadAsStringAsync();

            var doc = JsonDocument.Parse(json);
            return doc.RootElement
                      .GetProperty("candidates")[0]
                      .GetProperty("content")
                      .GetProperty("parts")[0]
                      .GetProperty("text")
                      .GetString();
        }

        private async Task<string[]> GenerateImagePrompts(string[] paragraphs)
        {
            var joined = string.Join("\n\n", paragraphs);

            var prompt = $"{joined}. For this story let’s generate descriptions for NAME CHARACTERS, SUBJECTS, AND SETTINGS HERE.\n\n" +
                         "I'm going to use your script for a story, and so I'm going to need images to go along with the text. " +
                         "Please write these image prompts for me with the following guidelines in mind:\n\n" +
                         "Always use the prompt template!\n\n" +
                         "Create exactly 1 image prompt to go along with each paragraph of the story (max " + paragraphs.Length + " prompts).\n\n" +
                         "Here is the prompt template:\n" +
                         "Use 3D animation and a 16:9 aspect ratio to create [subject] [detailed description of subject] in [setting/background description]. " +
                         "[The subject] is [placement in frame] and is [describe subject's action]. The POV is [describe the camera angle, focal length, and aperture] " +
                         "at [time of day and/or description of lighting]. The mood is [describe mood] in this scene.\n\n" +
                         "👉 Return only the image prompts in this exact template.";

            var imagePromptText = await CallGeminiModel(prompt, "gemini-2.0-flash");
            return Regex.Split(imagePromptText, @"(?=Use 3D animation)").Where(p => !string.IsNullOrWhiteSpace(p)).ToArray();
        }

        private async Task<string> GenerateImage(string imagePrompt)
        {
            try
            {
                var imagePromptBody = new
                {
                    contents = new[]
                    {
                        new
                        {
                            role = "user",
                            parts = new[] { new { text = imagePrompt } }
                        }
                    }
                };

                var response = await _httpClient.PostAsJsonAsync(
                    $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key={_apiKey}",
                    imagePromptBody
                );

                response.EnsureSuccessStatusCode();
                var json = await response.Content.ReadAsStringAsync();
                var doc = JsonDocument.Parse(json);

                foreach (var part in doc.RootElement.GetProperty("candidates")[0].GetProperty("content").GetProperty("parts").EnumerateArray())
                {
                    if (part.TryGetProperty("inlineData", out var inlineData))
                    {
                        return inlineData.GetProperty("data").GetString();
                    }
                }

                return null;
            }
            catch
            {
                return null;
            }
        }
    }
}
