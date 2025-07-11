using Server_Side.Models;
using System.Text.Json;

namespace Server_Side.Services
{
    public class ReadingPromptService
    {
        private readonly List<ReadingLevel> _readingLevels;

        public ReadingPromptService()
        {
            var json = File.ReadAllText("Config/reading_prompts.json");
            var doc = JsonDocument.Parse(json);
            var levelJson = doc.RootElement.GetProperty("reading_levels").GetRawText();

            _readingLevels = JsonSerializer.Deserialize<List<ReadingLevel>>(levelJson);
            Console.WriteLine("Deserialized Reading Levels:");
            foreach (var level in _readingLevels)
            {
                Console.WriteLine($"Level: {level.Level}, Prompt: {level.PromptTemplate.Substring(0, Math.Min(40, level.PromptTemplate.Length))}...");
            }
        }

        public string GetPromptByLevel(int level, string topic)
        {
            var levelData = _readingLevels.FirstOrDefault(l => l.Level == level);
            if (levelData == null)
                throw new ArgumentException($"Level {level} not found.");

            return levelData.PromptTemplate.Replace("{{topic}}", topic);
        }
    }
}
