namespace Server_Side.BL
{
    public class OverallFeedbackSummary
    {
        public string? FeedbackType { get; set; } // "Success", "Needs Improvement"
        public string? Comment { get; set; }      // Personalized or generated comment
        public string? Emoji { get; set; }        // 🌟, 🧐, etc.
    }

}
