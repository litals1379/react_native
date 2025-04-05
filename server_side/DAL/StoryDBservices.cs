using MongoDB.Driver;
using Server_Side.BL;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

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
        public async Task<string> GetStoryForChildAsync(string childID, string topic)
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

            // מציאת נתוני הילד בתוך רשימת הילדים של המשתמש
            var childData = user.Children.FirstOrDefault(c => c.Id == childID);
            if (childData == null)
            {
                Console.WriteLine($"Child data for ID {childID} not found.");
                return null;
            }

            int readingLevel = childData.ReadingLevel;

            // חיפוש סיפור שמתאים לרמת הקריאה ולנושא
            var story = await _storiesCollection
                .Find(s => s.ReadingLevel == readingLevel && s.Topic == topic)
                .FirstOrDefaultAsync();

            if (story == null)
            {
                Console.WriteLine($"No story found for reading level {readingLevel} and topic {topic}.");
                return null;
            }

            // הוספת הסיפור להיסטוריית הקריאה של הילד
            var readingHistoryEntry = new ReadingHistoryEntry(
                story.Id,
                feedbackID: "", // ניתן להוסיף פידבק מאוחר יותר
                readDate: DateTime.UtcNow
            );

            childData.ReadingHistory.Add(readingHistoryEntry);

            // עדכון מסד הנתונים עם היסטוריית הקריאה החדשה
            var update = Builders<User>.Update.Set(u => u.Children, user.Children);
            await _usersCollection.UpdateOneAsync(u => u.Id == user.Id, update);

            // החזרת הפסקה הראשונה מתוך הסיפור
            if (story.Paragraphs != null && story.Paragraphs.ContainsKey("פסקה 1"))
            {
                return story.Paragraphs["פסקה 1"];
            }

            Console.WriteLine($"No paragraphs found for story with ID {story.Id}");
            return null;
        }

        // מחזיר את רשימת הספרים(כותרות) של ילד ספציפי
        public async Task<List<string>> GetBooksReadByChildAsync(string childID)
        {
            // חיפוש המשתמש שמכיל את הילד עם ה-ID המתאים
            var user = await _usersCollection
                .Find(u => u.Children.Any(c => c.Id == childID))
                .FirstOrDefaultAsync();

            if (user == null)
            {
                Console.WriteLine($"Child with ID {childID} not found.");
                return new List<string>();
            }

            // איתור הילד בתוך המשתמש
            var childData = user.Children.FirstOrDefault(c => c.Id == childID);
            if (childData == null || childData.ReadingHistory == null || !childData.ReadingHistory.Any())
            {
                Console.WriteLine($"No reading history found for child ID {childID}.");
                return new List<string>();
            }

            // שליפת מזהי הסיפורים שהילד קרא
            var storyIDs = childData.ReadingHistory.Select(rh => rh.StoryID).ToList();

            // שליפת הכותרות מתוך מסד הנתונים
            var stories = await _storiesCollection
                .Find(s => storyIDs.Contains(s.Id))
                .Project(s => s.Title) // שליפת רק את הכותרת
                .ToListAsync();

            if (!stories.Any())
            {
                Console.WriteLine("Couldn't find any read books.");
            }

            return stories;
        }



    }
}
