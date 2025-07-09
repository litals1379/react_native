using Server_Side.BL;
using System.Threading.Tasks;

namespace Server_Side.Services
{
    public interface IGeminiService
    {
        Task<StoryResponse> GenerateStoryWithImagesAsync(string topic);

    }
}
