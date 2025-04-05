using MongoDB.Driver;
using Server_Side.BL;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Server_Side.DAL
{
    public class FeedbackDBservices
    {
        private readonly IMongoCollection<Feedback> _feedbackCollection;

        public FeedbackDBservices(IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase("storytimeDB");
            _feedbackCollection = database.GetCollection<Feedback>("feedback");
        }

        public async Task<List<Feedback>> GetFeedbacksAsync()
        {
            return await _feedbackCollection.Find(_ => true).ToListAsync();
        }

        public async Task<bool> AddFeedbackAsync(Feedback feedback)
        {
            await _feedbackCollection.InsertOneAsync(feedback);
            return true;
        }
    }
}
