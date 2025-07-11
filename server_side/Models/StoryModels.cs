namespace Server_Side.Models
{
    public class StoryRequest
    {
        public string Topic { get; set; }
        public int Level { get; set; }
    }

    public class StoryParagraph
    {
        public string Text { get; set; }
        public string ImagePrompt { get; set; }
        public string Image { get; set; } // base64 image
    }

    public class StoryResponse
    {
        public string Title { get; set; }
        public List<StoryParagraph> StoryParagraph { get; set; }
    }
}
