using Microsoft.EntityFrameworkCore;
using MoviePerspectives.Context;
using MoviePerspectives.Models;
using MoviePerspectives.Repositories.Abstract;

namespace MoviePerspectives.Repositories.Concrete
{
    public class EfFollowRepository : IFollowRepository
    {
        private readonly MovieContext _ctx;
        public EfFollowRepository(MovieContext ctx) => _ctx = ctx;

        public async Task AddAsync(string followerUsername, string followeeUsername)
        {
            var existing = await _ctx.Follows.FindAsync(followerUsername, followeeUsername);
            if (existing == null)
            {
                _ctx.Follows.Add(new Follow {
                    FollowerUsername = followerUsername,
                    FolloweeUsername = followeeUsername
                });
                await _ctx.SaveChangesAsync();
            }
        }

        public async Task<bool> RemoveAsync(string followerUsername, string followeeUsername)
        {
            var f = await _ctx.Follows.FindAsync(followerUsername, followeeUsername);
            if (f == null) return false;
            _ctx.Follows.Remove(f);
            await _ctx.SaveChangesAsync();
            return true;
        }

        public Task<List<string>> GetFollowersAsync(string followeeUsername) =>
            _ctx.Follows
                .Where(f => f.FolloweeUsername == followeeUsername)
                .Select(f => f.FollowerUsername)
                .ToListAsync();

        public Task<List<string>> GetFollowingAsync(string followerUsername) =>
            _ctx.Follows
                .Where(f => f.FollowerUsername == followerUsername)
                .Select(f => f.FolloweeUsername)
                .ToListAsync();

        public Task<bool> UserExistsAsync(string username) =>
            _ctx.Users.AnyAsync(u => u.Username == username);
    }
}
