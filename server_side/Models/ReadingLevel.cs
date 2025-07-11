using System.Text.Json.Serialization;

namespace Server_Side.Models
{
    public class ReadingLevel
    {
        [JsonPropertyName("level")]
        public int Level { get; set; }

        [JsonPropertyName("reading_stage")]
        public string ReadingStage { get; set; }

        [JsonPropertyName("word_count")]
        public string WordCount { get; set; }

        [JsonPropertyName("sentence_length")]
        public string SentenceLength { get; set; }

        [JsonPropertyName("vowelization")]
        public string Vowelization { get; set; }

        [JsonPropertyName("language_features")]
        public List<string> LanguageFeatures { get; set; }

        [JsonPropertyName("prompt")]
        public string PromptTemplate { get; set; }
    }
}
