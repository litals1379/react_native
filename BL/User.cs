using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;

namespace Server_Side.BL
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public string Email { get; set; }
        public string Password { get; set; }

        public List<ParentDetail> ParentDetails { get; set; } = new List<ParentDetail>();
        public List<Child> Children { get; set; } = new List<Child>();
    }

    public class ParentDetail
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
    }

    public class Child
    {
        [BsonElement("childID")]
        public string ChildID { get; set; }

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }

        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime Birthdate { get; set; }

        public int ReadingLevel { get; set; }
        public List<ReadingHistoryEntry> ReadingHistory { get; set; } = new List<ReadingHistoryEntry>();
    }

    public class ReadingHistoryEntry
    {
        public string StoryID { get; set; }
        public string FeedbackID { get; set; }
    }
}
