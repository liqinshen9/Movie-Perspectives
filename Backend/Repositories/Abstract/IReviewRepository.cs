using MoviePerspectives.Models;

namespace MoviePerspectives.Repositories.Abstract
{
    public interface IReviewRepository
    {
        Task<List<Review>> GetAllForMovieAsync(int movieId);
        Task AddAsync(Review r);
        Task<bool> DeleteAsync(int reviewId, string username);
    }
}
