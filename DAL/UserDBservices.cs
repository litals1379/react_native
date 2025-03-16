using MongoDB.Driver;
using Server_Side.BL;
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

        // קבלת רשימת משתמשים
        public async Task<List<User>> GetUsersAsync()
        {
            return await _usersCollection.Find(_ => true).ToListAsync();
        }

        // פונקציית התחברות
        public async Task<User> LoginAsync(string email, string password)
        {
            // חיפוש משתמש לפי אימייל
            var user = await _usersCollection.Find(u => u.Email == email).FirstOrDefaultAsync();
            if (user == null)
            {
                return null;
            }

            if (user.Password == password)
            {
                return user; // אם הסיסמה נכונה, מחזירים את המידע של המשתמש
            }

            return null;
        }


        // קבלת משתמש לפי מזהה
        public async Task<User> GetUserByIdAsync(string userId)
        {
            // חיפוש משתמש לפי מזהה (כמו childID או userID)
            var user = await _usersCollection.Find(u => u.Id == userId).FirstOrDefaultAsync();
            return user;
        }
    }
}
