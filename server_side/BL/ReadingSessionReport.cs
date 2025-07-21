using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
namespace Server_Side.BL
{
    public class ReadingSessionReport
    {

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string? StoryId { get; set; }
        public string? UserId { get; set; }
        public string? ChildId { get; set; }   // The child who read

        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }

        public int TotalParagraphs { get; set; }
        public int CompletedParagraphs { get; set; }
        public int TotalErrors { get; set; }

        public List<ParagraphFeedback> Paragraphs { get; set; } = new();
        public OverallFeedbackSummary Summary { get; set; } = new();
    }

}
