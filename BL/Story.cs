using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;

namespace Server_Side.BL
{
    public class Story
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public string Id { get; set; }

        [BsonElement("title")]
        public string Title { get; set; }

        [BsonElement("topic")]
        public string Topic { get; set; }

        [BsonElement("paragraphs")]
        public Dictionary<string, string> Paragraphs { get; set; } // שינוי המפתח ל-string

        [BsonElement("readingLevel")]
        public int ReadingLevel { get; set; }

        public Story() { }

        public Story(string id, string title, string topic, Dictionary<string, string> paragraphs, int readingLevel)
        {
            Id = id;
            Title = title;
            Topic = topic;
            Paragraphs = paragraphs;
            ReadingLevel = readingLevel;
        }
    }
}
