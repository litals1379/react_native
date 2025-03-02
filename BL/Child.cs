public class Child
{
    public string ChildID { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Username { get; set; }
    public string Password { get; set; }
    public DateTime Birthdate { get; set; }
    public int ReadingLevel { get; set; }

    public Dictionary<string, string> ReadingHistory { get; set; } // Key: StoryID, Value: FeedbackID

    public void UpdateReadingLevel(int newLevel) { /* קוד לעדכון רמת קריאה */ }
    public Dictionary<string, string> GetReadingHistory() { /* קוד לקבלת היסטוריית קריאה */ return new Dictionary<string, string>(); }
}
