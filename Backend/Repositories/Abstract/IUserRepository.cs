using MoviePerspectives.Models;

namespace MoviePerspectives.Repositories.Abstract
{
    public interface IUserRepository
    {
        Task<bool> ExistsAsync(string username);
        Task AddAsync(User user);
        Task<User?> ValidateCredentialsAsync(string username, string password);
    }
}
