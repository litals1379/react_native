using MongoDB.Driver;
using Server_Side.BL;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using MongoDB.Bson;

namespace Server_Side.DAL
{
    public class StoryDBservices
    {
        private readonly IMongoCollection<Story> _storiesCollection;
        private readonly IMongoCollection<User> _usersCollection;

        public StoryDBservices(IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase("storytimeDB");
            _storiesCollection = database.GetCollection<Story>("stories");
            _usersCollection = database.GetCollection<User>("users");
        }

        // פונקציה שמחזירה סיפור מתאים לילד לפי רמה ונושא
        public async Task<Story> GetStoryForChildAsync(string childID, string topic)
        {
            // חיפוש המשתמש שמכיל את הילד עם ה-ID המתאים
            var user = await _usersCollection
                .Find(u => u.Children.Any(c => c.Id == childID))
                .FirstOrDefaultAsync();

            if (user == null)
            {
                Console.WriteLine($"Child with ID {childID} not found.");
                return null;
            }

            // מציאת נתוני הילד
            var childData = user.Children.FirstOrDefault(c => c.Id == childID);
            if (childData == null)
            {
                Console.WriteLine($"Child data for ID {childID} not found.");
                return null;
            }

            int readingLevel = childData.ReadingLevel;

            // רשימת הסיפורים שהילד כבר קרא
            var readStoryIds = childData.ReadingHistory.Select(rh => rh.StoryId).ToHashSet();

            // חיפוש סיפור חדש שלא קרא עדיין, שמתאים לרמת הקריאה והנושא
            var story = await _storiesCollection
                .Find(s => s.ReadingLevel == readingLevel && s.Topic == topic && !readStoryIds.Contains(s.Id))
                .FirstOrDefaultAsync();

            if (story == null)
            {
                Console.WriteLine($"No new story found for reading level {readingLevel} and topic {topic}.");
                return null;
            }

            // הוספת הסיפור להיסטוריית הקריאה של הילד
            var readingHistoryEntry = new ReadingHistoryEntry(
                story.Id,
                feedbackID: "", // ניתן לעדכן בהמשך
                readDate: DateTime.UtcNow
            );

            childData.ReadingHistory.Add(readingHistoryEntry);

            // עדכון רשימת הילדים במסד הנתונים
            var update = Builders<User>.Update.Set(u => u.Children, user.Children);
            await _usersCollection.UpdateOneAsync(u => u.Id == user.Id, update);

            return story;
        }
        // החזרת רשימת סיפורים מתאימים לנושא ולרמה
        public async Task<List<Story>> GetAvailableStoriesForChildAsync(string childID, string topic)
        {
            var user = await _usersCollection
                .Find(u => u.Children.Any(c => c.Id == childID))
                .FirstOrDefaultAsync();

            if (user == null) return new List<Story>();

            var childData = user.Children.FirstOrDefault(c => c.Id == childID);
            if (childData == null) return new List<Story>();

            int readingLevel = childData.ReadingLevel;
            var readStoryIds = childData.ReadingHistory.Select(rh => rh.StoryId).ToHashSet();

            var stories = await _storiesCollection
                .Find(s => s.ReadingLevel == readingLevel && s.Topic == topic && !readStoryIds.Contains(s.Id))
                .ToListAsync();

            return stories ?? new List<Story>();
        }



        // מחזיר את רשימת הספרים(כותרות) של ילד ספציפי
        public async Task<List<Story>> GetBooksReadByChildAsync(string childID)
        {
            var user = await _usersCollection
                .Find(u => u.Children.Any(c => c.Id == childID))
                .FirstOrDefaultAsync();

            if (user == null)
            {
                Console.WriteLine($"Child with ID {childID} not found.");
                return new List<Story>();
            }

            var childData = user.Children.FirstOrDefault(c => c.Id == childID);
            if (childData == null || childData.ReadingHistory == null || !childData.ReadingHistory.Any())
            {
                Console.WriteLine($"No reading history found for child ID {childID}.");
                return new List<Story>();
            }

            var storyIDs = childData.ReadingHistory.Select(rh => rh.StoryId).ToList();

            // שליפת כל הסיפורים המלאים לפי מזהה
            var stories = await _storiesCollection
                .Find(s => storyIDs.Contains(s.Id))
                .ToListAsync();

            return stories;
        }



        public async Task<Story> GetStoryByIdAsync(string id)
        {
            var filter = Builders<Story>.Filter.Eq(s => s.Id, id);
            var story = await _storiesCollection.Find(filter).FirstOrDefaultAsync();
            return story;
        }

    }
}
