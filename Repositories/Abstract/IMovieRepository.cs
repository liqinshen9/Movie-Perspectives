using MoviePerspectives.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MoviePerspectives.Repositories.Abstract
{
    public interface IMovieRepository
    {
        Task<IEnumerable<Movie>> GetAllAsync();
        Task<Movie?> GetByIdAsync(int id);
        Task<Movie> AddAsync(Movie movie);
        Task UpdateAsync(Movie movie);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }
}
