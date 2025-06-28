using Microsoft.EntityFrameworkCore;
using MoviePerspectives.Context;
using MoviePerspectives.Models;
using MoviePerspectives.Repositories.Abstract;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MoviePerspectives.Repositories.Concrete
{
    public class ReviewRepository : IReviewRepository
    {
        private readonly MovieContext _db;
        public ReviewRepository(MovieContext db) => _db = db;

        public async Task<IEnumerable<Review>> GetAllByMovieAsync(int movieId) =>
            await _db.Reviews
                     .Where(r => r.MovieId == movieId)
                     .ToListAsync();

        public async Task<Review?> GetByIdAsync(int id) =>
            await _db.Reviews.FindAsync(id);

        public async Task<Review> AddAsync(Review review)
        {
            _db.Reviews.Add(review);
            await _db.SaveChangesAsync();
            return review;
        }

        public async Task UpdateAsync(Review review)
        {
            _db.Reviews.Update(review);
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var r = await _db.Reviews.FindAsync(id);
            if (r is not null)
            {
                _db.Reviews.Remove(r);
                await _db.SaveChangesAsync();
            }
        }
    }
}
