using Microsoft.EntityFrameworkCore;
using MoviePerspectives.Context;
using MoviePerspectives.Models;
using MoviePerspectives.Repositories.Abstract;

namespace MoviePerspectives.Repositories.Concrete
{
    public class EfReviewRepository : IReviewRepository
    {
        private readonly MovieContext _ctx;
        public EfReviewRepository(MovieContext ctx) => _ctx = ctx;

        public Task<List<Review>> GetAllForMovieAsync(int movieId) =>
            _ctx.Reviews
                .Where(r => r.MovieId == movieId)
                .OrderByDescending(r => r.ReviewDate)
                .AsNoTracking()
                .ToListAsync();

        public async Task AddAsync(Review r)
        {
            _ctx.Reviews.Add(r);
            await _ctx.SaveChangesAsync();
        }

        public async Task<bool> DeleteAsync(int id, string username)
        {
            var r = await _ctx.Reviews.FindAsync(id);
            if (r == null || r.Username != username) return false;
            _ctx.Reviews.Remove(r);
            await _ctx.SaveChangesAsync();
            return true;
        }
    }
}
