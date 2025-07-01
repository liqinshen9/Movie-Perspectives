using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MoviePerspectives.Context;
using MoviePerspectives.Models;
using MoviePerspectives.Repositories.Abstract;
using BCrypt.Net;

namespace MoviePerspectives.Repositories.Concrete
{
    public class EfUserRepository : IUserRepository
    {
        private readonly MovieContext _ctx;
        public EfUserRepository(MovieContext ctx) => _ctx = ctx;

        public async Task<bool> ExistsAsync(string username) =>
            await _ctx.Users.AnyAsync(u => u.Username == username);

        public async Task AddAsync(User user)
        {

            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            _ctx.Users.Add(user);
            await _ctx.SaveChangesAsync();
        }

        public async Task<bool> ValidateCredentialsAsync(string username, string password)
        {
            var user = await _ctx.Users.FindAsync(username);
            if (user == null) return false;
            return BCrypt.Net.BCrypt.Verify(password, user.Password);
        }

        public async Task<bool> DeleteCommentAsync(int commentId, string username)
        {
            return false;
        }
    }
}
