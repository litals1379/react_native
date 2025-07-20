namespace Server_Side.BL
{
    public class ParagraphFeedback
    {
        public int ParagraphIndex { get; set; }
        public string? Text { get; set; }
        public List<string> ProblematicWords { get; set; } = new();
        public int Attempts { get; set; } = 1;
        public bool WasSuccessful { get; set; }
    }

}
