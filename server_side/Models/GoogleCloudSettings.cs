namespace Server_Side.Models
{
    public class GoogleCloudSettings
    {
        public string ProjectId { get; set; }
        public string Region { get; set; }
        public string ServiceAccountKeyJson { get; set; } // The actual JSON content
    }
}
