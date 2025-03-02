namespace Server_Side.BL
{
    public class Story
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Topic { get; set; }
        public string Content { get; set; }
        public int ReadingLevel { get; set; }

        public Story() { }

        public Story(string id, string title, string topic, string content, int readingLevel)
        {
            Id = id;
            Title = title;
            Topic = topic;
            Content = content;
            ReadingLevel = readingLevel;
        }

        public void AddStory() { /* קוד להוספת סיפור */ }

        public void UpdateStoryReadingLevel() { /* קוד לעדכון רמת הסיפור */ }

        public void DeleteStory() { /* קוד למחיקת סיפור */ }

    }
}
