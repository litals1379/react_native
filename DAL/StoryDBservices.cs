using MongoDB.Driver;
using Server_Side.BL;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Server_Side.DAL
{
    public class StoryDBservices
    {
        private readonly IMongoCollection<Story> _storiesCollection;

        public StoryDBservices(IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase("storytimeDB");
            _storiesCollection = database.GetCollection<Story>("stories");
        }

        public async Task<List<Story>> GetAllStoriesAsync()
        {
            return await _storiesCollection.Find(_ => true).ToListAsync();
        }

        public async Task<bool> AddStoryAsync(Story story)
        {
            await _storiesCollection.InsertOneAsync(story);
            return true;
        }
    }
}
