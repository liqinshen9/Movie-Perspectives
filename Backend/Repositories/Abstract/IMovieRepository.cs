using MoviePerspectives.Models;

namespace MoviePerspectives.Repositories.Abstract
{
    public interface IMovieRepository
    {
        Task<IEnumerable<Movie>> GetAllAsync();
        Task<Movie?> GetByIdAsync(int id);
    }
}
