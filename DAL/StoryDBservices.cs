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
                .Find(u => u.Children.Any(c => c.Id == childID)) // חיפוש לפי מזהה הילד במחרוזת
                .FirstOrDefaultAsync();

            if (user == null)
            {
                Console.WriteLine($"Child with ID {childID} not found.");
                return null;
            }

            // מציאת נתוני הילד בתוך רשימת הילדים של המשתמש
            var childData = user.Children.FirstOrDefault(c => c.Id == childID); // חיפוש לפי מזהה הילד במחרוזת
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

            // החזרת הפסקה הראשונה מתוך הסיפור
            if (story.Paragraphs != null && story.Paragraphs.Count > 0)
            {
                return story.Paragraphs["פסקה 1"]; // החזרת פסקה 1 מתוך האובייקט
            }

            Console.WriteLine($"No paragraphs found for story with ID {story.Id}");
            return null;
        }

    }
}
