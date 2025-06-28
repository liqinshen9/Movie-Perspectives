using MoviePerspectives.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MoviePerspectives.Repositories.Abstract
{
    public interface IReviewRepository
    {
        Task<IEnumerable<Review>> GetAllByMovieAsync(int movieId);
        Task<Review?> GetByIdAsync(int id);
        Task<Review> AddAsync(Review review);
        Task UpdateAsync(Review review);
        Task DeleteAsync(int id);
    }
}
