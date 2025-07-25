﻿using MongoDB.Bson;
using MongoDB.Driver;
using Server_Side.BL;
using Server_Side.Controllers;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Server_Side.DAL
{
    public class UserDBservices
    {
        private readonly IMongoCollection<User> _usersCollection;

        public UserDBservices(IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase("storytimeDB");
            _usersCollection = database.GetCollection<User>("users");
        }

        // הוספת משתמש
        public async Task<bool> AddUserAsync(User user)
        {
            var existingUser = await _usersCollection.Find(u => u.Email == user.Email).FirstOrDefaultAsync();
            if (existingUser != null)
            {
                return false; // הימנעות משימוש בדוא"ל כפול
            }
            await _usersCollection.InsertOneAsync(user);
            return true;
        }

        public async Task<bool> AddChildAsync(string userEmail, Child child)
        {
            try
            {
                // מציאת המשתמש לפי אימייל
                var user = await _usersCollection.Find(u => u.Email == userEmail).FirstOrDefaultAsync();

                if (user == null)
                {
                    // אם לא נמצא משתמש עם האימייל, מחזירים false
                    return false;
                }

                // בדיקה אם הילד כבר קיים ברשימת הילדים של המשתמש
                if (user.Children.Any(c => c.FirstName == child.FirstName && c.Birthdate == child.Birthdate))
                {
                    return false; // הילד כבר קיים ברשימה
                }

                // הוספת הילד לרשימת הילדים של המשתמש
                var update = Builders<User>.Update.Push(u => u.Children, child);

                var result = await _usersCollection.UpdateOneAsync(
                    u => u.Email == userEmail,
                    update
                );

                return result.ModifiedCount > 0; // מחזירים true אם העדכון הצליח
            }
            catch (Exception ex)
            {
                // רישום השגיאה
                Console.WriteLine($"Error: {ex.Message}");
                return false;
            }
        }

        // קבלת רשימת משתמשים
        public async Task<List<User>> GetUsersAsync()
        {
            return await _usersCollection.Find(_ => true).ToListAsync();
        }

        public async Task<User> LoginAsync(string username, string password)
        {
            var user = await _usersCollection.Find(u => u.Username == username).FirstOrDefaultAsync();

            if (user == null)
            {
                return null; // המשתמש לא נמצא
            }

            if (user.Password == password)
            {
                return user; // אם הסיסמה נכונה, מחזירים את המשתמש
            }

            return null; // סיסמה לא נכונה
        }

        // קבלת משתמש לפי מזהה
        public async Task<User> GetUserByIdAsync(string userId)
        {
            // חיפוש משתמש לפי מזהה (כמו childID או userID)
            var user = await _usersCollection.Find(u => u.Id == userId).FirstOrDefaultAsync();
            return user;
        }

        public async Task<bool> UpdateUserProfileImageAsync(string userId, string imageUrl)
        {
            try
            {
                var filter = Builders<User>.Filter.Eq(u => u.Id, userId);
                var update = Builders<User>.Update.Set(u => u.ProfileImage, imageUrl);
                var result = await _usersCollection.UpdateOneAsync(filter, update);
                return result.ModifiedCount > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating profile image for user {userId}: {ex.Message}");
                return false;
            }
        }

        // מחיקת משתמש
        public async Task<bool> DeleteUserAsync(string userId)
        {
            // מחיקת משתמש לפי מזהה
            try
            {
                var result = await _usersCollection.DeleteOneAsync(u => u.Id == userId);
                return result.DeletedCount > 0; // מחזירים true אם נמחק משתמש
            }
            catch (Exception ex)
            {
                // רישום השגיאה
                Console.WriteLine($"Error deleting user {userId}: {ex.Message}");
                return false;
            }
        }

        // עדכון פרטי משתמש
        public async Task<bool> UpdateUserAsync(string userId, User updatedUser)
        {
            try
            {
                var filter = Builders<User>.Filter.Eq(u => u.Id, userId);
                var update = Builders<User>.Update
                    .Set(u => u.Username, updatedUser.Username)
                    .Set(u => u.Password, updatedUser.Password)
                    .Set(u => u.Email, updatedUser.Email)
                    .Set(u => u.ParentDetails, updatedUser.ParentDetails)
                    .Set(u => u.Children, updatedUser.Children);

                var result = await _usersCollection.UpdateOneAsync(filter, update);
                return result.ModifiedCount > 0; // מחזירים true אם העדכון הצליח
            }
            catch (Exception ex)
            {
                // רישום השגיאה
                Console.WriteLine($"Error updating user {userId}: {ex.Message}");
                return false;
            }
        }

        public async Task<User> GetUserByEmailAsync(string email)
        {
            try
            {
                var user = await _usersCollection.Find(u => u.Email == email).FirstOrDefaultAsync();
                return user;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error retrieving user by email {email}: {ex.Message}");
                return null;
            }
        }
        public async Task<bool> AddStoryToChildHistoryAsync(string userId, string childId, string storyId)
        {
            try
            {
                var filter = Builders<User>.Filter.And(
                    Builders<User>.Filter.Eq(u => u.Id, userId),
                    Builders<User>.Filter.ElemMatch(u => u.Children, c => c.Id == childId)
                );

                var historyEntry = new ReadingHistoryEntry(
                    storyID: storyId,
                    feedbackID: "", // Empty or can be removed entirely if you want
                    readDate: DateTime.UtcNow
                );

                var update = Builders<User>.Update.Push("children.$.readingHistory", historyEntry);

                var result = await _usersCollection.UpdateOneAsync(filter, update);

                return result.ModifiedCount > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error adding story to reading history for child {childId} in user {userId}: {ex.Message}");
                return false;
            }
        }

    }
}