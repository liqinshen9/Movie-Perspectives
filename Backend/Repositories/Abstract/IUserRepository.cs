using MoviePerspectives.Models;
using System.Threading.Tasks;

namespace MoviePerspectives.Repositories.Abstract
{
    public interface IUserRepository
    {
        Task<User?> GetByIdAsync(int id);
        Task<User> AddAsync(User user);
        // (Add other methods like GetAll, Exists, etc., if needed)
    }
}
