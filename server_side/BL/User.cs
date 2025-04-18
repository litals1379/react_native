using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Server_Side.BL
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

        [BsonElement("username")]
        [Required]  // דרישה חובה
        public string Username { get; set; }

        [BsonElement("password")]
        [Required]  // דרישה חובה
        public string Password { get; set; }

        [BsonElement("email")]
        public string? Email { get; set; } // הפיכת אימייל לשדה אופציונלי

        [BsonElement("profileImage")]
        public string? ProfileImage { get; set; }

        [BsonElement("parentDetails")]
        public List<ParentDetail> ParentDetails { get; set; } = new List<ParentDetail>();

        [BsonElement("children")]
        public List<Child> Children { get; set; } = new List<Child>();

        
        // קונסטרקטור חדש שמאפשר יצירת משתמש ללא אימייל
        public User(string username, string password, string? email = null, string? profileImage = null)
        {
            Username = username;
            Password = password;
            Email = email; // יכול להיות ריק
            ProfileImage = profileImage;
            ParentDetails = new List<ParentDetail>();
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
        [BsonRepresentation(BsonType.ObjectId)] // השדה הזה הוא ObjectId עכשיו
        [BsonElement("childID")] // עדכון כך שיתאים לשם השדה במסד הנתונים
        public string Id { get; set; } = ObjectId.GenerateNewId().ToString(); // מייצר מזהה חדש בתור מחרוזת

        [BsonElement("firstName")]
        public string FirstName { get; set; }


        [BsonElement("birthdate")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime Birthdate { get; set; }

        [BsonElement("readingLevel")]
        public int ReadingLevel { get; set; }

        [BsonElement("readingHistory")]
        public List<ReadingHistoryEntry> ReadingHistory { get; set; } = new List<ReadingHistoryEntry>();

        // בנאי
        public Child(string firstName,/* /string lastName, string username, string password,/*/ DateTime birthdate, int readingLevel)
        {
            FirstName = firstName;
            //LastName = lastName;
            //Username = username;
            //Password = password;
            Birthdate = birthdate;
            ReadingLevel = readingLevel;
            ReadingHistory = new List<ReadingHistoryEntry>();
        }
    }

    public class ReadingHistoryEntry
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)] // השדה הזה הוא ObjectId גם
        public string Id { get; set; } = ObjectId.GenerateNewId().ToString(); // מייצר מזהה חדש בתור מחרוזת

        [BsonElement("storyID")]
        public string StoryId { get; set; }

        [BsonElement("feedbackID")]
        public string FeedbackID { get; set; }

        [BsonElement("readDate")]
        public DateTime ReadDate { get; set; }

        // בנאי
        public ReadingHistoryEntry(string storyID, string feedbackID, DateTime readDate)
        {
            StoryId = storyID;
            FeedbackID = feedbackID;
            ReadDate = readDate;
        }
    }
}