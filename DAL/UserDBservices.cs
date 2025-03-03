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

        public async Task<List<User>> GetUsersAsync()
        {
            return await _usersCollection.Find(_ => true).ToListAsync();
        }

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
    }
}
