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

        [BsonElement("parentDetails")]
        public List<ParentDetail> ParentDetails { get; set; } = new List<ParentDetail>();

        [BsonElement("email")]
        public string Email { get; set; }

        [BsonElement("username")]
        public string Username { get; set; } 

        [BsonElement("password")]
        public string Password { get; set; }


        [BsonElement("children")]
        public List<Child> Children { get; set; } = new List<Child>();

        // בנאי
        public User(string email, string username, string password)
        {
            ParentDetails = new List<ParentDetail>();
            Email = email;
            Username = username;
            Password = password;
            Children = new List<Child>();
        }
    }

    [BsonIgnoreExtraElements]
    public class ParentDetail
    {
        [BsonElement("firstName")]
        public string FirstName { get; set; }

        [BsonElement("lastName")]
        public string LastName { get; set; }

        [BsonElement("phoneNumber")]
        public string PhoneNumber { get; set; }

        public ParentDetail(string firstName, string lastName, string phoneNumber)
        {
            FirstName = firstName;
            LastName = lastName;
            PhoneNumber = phoneNumber;
        }
    }
    public class Child
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        [BsonElement("childID")]// עדכון כך שיתאים לשם השדה במסד הנתונים
        public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

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

        public Child(string firstName, string lastName, string username, string password, DateTime birthdate, int readingLevel)
        {
            Id = ObjectId.GenerateNewId().ToString();
            FirstName = firstName;
            LastName = lastName;
            Username = username;
            Password = password;
            Birthdate = birthdate;
            ReadingLevel = readingLevel;
            ReadingHistory = new List<ReadingHistoryEntry>();
        }
    }


    public class ReadingHistoryEntry
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

        [BsonElement("storyID")]
        public string StoryID { get; set; }

        [BsonElement("feedbackID")]
        public string FeedbackID { get; set; }

        [BsonElement("readDate")]
        public DateTime ReadDate { get; set; }

        // בנאי
        public ReadingHistoryEntry(string storyID, string feedbackID, DateTime readDate)
        {
            StoryID = storyID;
            FeedbackID = feedbackID;
            ReadDate = readDate;
        }
    }
}
