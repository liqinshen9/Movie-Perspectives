using Microsoft.EntityFrameworkCore;
using MoviePerspectives.Context;
using MoviePerspectives.Models;
using MoviePerspectives.Repositories.Abstract;

namespace MoviePerspectives.Repositories.Concrete
{
    public class EfChatRepository : IChatRepository
    {
        private readonly MovieContext _ctx;
        public EfChatRepository(MovieContext ctx) => _ctx = ctx;

        public async Task<IList<ChatMessage>> GetConversationAsync(string userA, string userB)
        {
            return await _ctx.ChatMessages
                .Where(m =>
                   (m.FromUsername == userA && m.ToUsername == userB) ||
                   (m.FromUsername == userB && m.ToUsername == userA)
                )
                .OrderBy(m => m.SentAt)
                .ToListAsync();
        }

        public async Task<ChatMessage> AddAsync(ChatMessage message)
        {
            message.Id     = 0;
            message.SentAt = DateTime.UtcNow;
            await _ctx.ChatMessages.AddAsync(message);
            await _ctx.SaveChangesAsync();
            return message;
        }
    }
}
