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
        public string Id { get; set; } = ObjectId.GenerateNewId().ToString(); // יצירת מזהה אוטומטי

        [BsonElement("email")]
        public string Email { get; set; }

        [BsonElement("password")]
        public string Password { get; set; }

        [BsonElement("parentDetails")]
        public List<ParentDetail> ParentDetails { get; set; } = new List<ParentDetail>(); // הוספת BsonElement עבור parentDetails

        [BsonElement("children")]
        public List<Child> Children { get; set; } = new List<Child>();
    }

    public class ParentDetail
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = ObjectId.GenerateNewId().ToString(); // יצירת מזהה ייחודי לכל הורה

        [BsonElement("firstName")]
        public string FirstName { get; set; }

        [BsonElement("lastName")]
        public string LastName { get; set; }

        [BsonElement("phoneNumber")]
        public string PhoneNumber { get; set; }
    }

    public class Child
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = ObjectId.GenerateNewId().ToString(); // יצירת מזהה ייחודי לכל ילד

        [BsonElement("childID")]
        public string ChildID { get; set; }

        [BsonElement("firstName")]
        public string FirstName { get; set; }

        [BsonElement("lastName")]
        public string LastName { get; set; }

        [BsonElement("username")]
        public string Username { get; set; }

        [BsonElement("password")]
        public string Password { get; set; }

        [BsonElement("birthdate")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime Birthdate { get; set; }

        [BsonElement("readingLevel")]
        public int ReadingLevel { get; set; }

        [BsonElement("readingHistory")]
        public List<ReadingHistoryEntry> ReadingHistory { get; set; } = new List<ReadingHistoryEntry>();
    }

    public class ReadingHistoryEntry
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = ObjectId.GenerateNewId().ToString(); // מזהה ייחודי לכל היסטוריית קריאה

        [BsonElement("storyID")]
        public string StoryID { get; set; }

        [BsonElement("feedbackID")]
        public string FeedbackID { get; set; }

        // הוספת שדה readDate כדי להתאים לשדה במונגוDB
        [BsonElement("readDate")]
        public DateTime ReadDate { get; set; }
    }
}
