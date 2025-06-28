using MoviePerspectives.Context;
using MoviePerspectives.Models;
using MoviePerspectives.Repositories.Abstract;
using System.Threading.Tasks;

namespace MoviePerspectives.Repositories.Concrete
{
    public class UserRepository : IUserRepository
    {
        private readonly MovieContext _db;
        public UserRepository(MovieContext db) => _db = db;

        public async Task<User?> GetByIdAsync(int id) =>
            await _db.Users.FindAsync(id);

        public async Task<User> AddAsync(User user)
        {
            _db.Users.Add(user);
            await _db.SaveChangesAsync();
            return user;
        }
    }
}
