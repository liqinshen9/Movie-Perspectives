using System.Collections.Generic;
using System.Threading.Tasks;

namespace MoviePerspectives.Repositories.Abstract
{
    public interface IFollowRepository
    {
        Task AddAsync(string followerUsername, string followeeUsername);
        Task<bool> RemoveAsync(string followerUsername, string followeeUsername);
        Task<List<string>> GetFollowersAsync(string followeeUsername);
        Task<List<string>> GetFollowingAsync(string followerUsername);
        Task<bool> UserExistsAsync(string username);
    }
}
