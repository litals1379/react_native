using MongoDB.Driver;
using Server_Side.BL;
using System.Collections.Generic;
using System.Threading.Tasks;

public class ReadingSessionReportDBservices
{
    private readonly IMongoCollection<ReadingSessionReport> _reportCollection;

    public ReadingSessionReportDBservices(IMongoClient mongoClient)
    {
        var database = mongoClient.GetDatabase("storytimeDB");
        _reportCollection = database.GetCollection<ReadingSessionReport>("reports");
    }

    public async Task<List<ReadingSessionReport>> GetAllReportsAsync()
    {
        return await _reportCollection.Find(_ => true).ToListAsync();
    }

    public async Task<List<ReadingSessionReport>> GetFilteredReportsAsync(string storyId, string userId, string childId)
    {
        var filterBuilder = Builders<ReadingSessionReport>.Filter;
        var filters = new List<FilterDefinition<ReadingSessionReport>>();

        if (!string.IsNullOrEmpty(storyId))
            filters.Add(filterBuilder.Eq(r => r.StoryId, storyId));
        if (!string.IsNullOrEmpty(userId))
            filters.Add(filterBuilder.Eq(r => r.UserId, userId));
        if (!string.IsNullOrEmpty(childId))
            filters.Add(filterBuilder.Eq(r => r.ChildId, childId));

        var finalFilter = filters.Count > 0 ? filterBuilder.And(filters) : filterBuilder.Empty;
        return await _reportCollection.Find(finalFilter).ToListAsync();
    }

    public async Task<bool> AddReportAsync(ReadingSessionReport report)
    {
        await _reportCollection.InsertOneAsync(report);
        return true;
    }
}
