using MoviePerspectives.Models;

namespace MoviePerspectives.Repositories.Abstract
{
    public interface IMovieRepository
    {
        Task<List<Movie>> GetAllAsync();
        Task<Movie?>     GetByIdAsync(int id);
    }
}
