using MoviePerspectives.Models;

namespace MoviePerspectives.Repositories.Abstract
{
    public interface IChatRepository
    {
        Task<IList<ChatMessage>> GetConversationAsync(string userA, string userB);
        Task<ChatMessage> AddAsync(ChatMessage message);
    }
}
