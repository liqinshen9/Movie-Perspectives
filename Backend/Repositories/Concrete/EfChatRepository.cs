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

        public async Task<ChatMessage> AddAsync(ChatMessage message)
        {
            _ctx.ChatMessages.Add(message);
            await _ctx.SaveChangesAsync();
            return message;
        }

        public async Task<IList<ChatMessage>> GetConversationAsync(string userA, string userB)
        {
            return await _ctx.ChatMessages
               .Where(m =>
                  (m.FromUsername == userA && m.ToUsername == userB)
               || (m.FromUsername == userB && m.ToUsername == userA)
               )
               .OrderBy(m => m.SentAt)
               .ToListAsync();
        }

        public async Task<ChatMessage?> GetByIdAsync(int id)
        {
            return await _ctx.ChatMessages.FindAsync(id);
        }

        public async Task DeleteAsync(int id)
        {
            var msg = await _ctx.ChatMessages.FindAsync(id);
            if (msg != null)
            {
                _ctx.ChatMessages.Remove(msg);
                await _ctx.SaveChangesAsync();
            }
        }
    }
}
