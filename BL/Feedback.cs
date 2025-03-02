public class Feedback
{
    public string Id { get; set; }
    public string StoryID { get; set; }
    public string UserID { get; set; }
    public string FeedbackType { get; set; }
    public string Comment { get; set; }
    public DateTime TimeCreated { get; set; }
    public int ErrorsInReading { get; set; }


    public void AddFeedback() { /* קוד להוספת משוב */ }
    public void GetFeedback() { /* קוד לקבלת משוב */ }
}