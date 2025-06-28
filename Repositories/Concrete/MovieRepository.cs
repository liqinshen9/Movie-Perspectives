using Microsoft.EntityFrameworkCore;
using MoviePerspectives.Context;
using MoviePerspectives.Models;
using MoviePerspectives.Repositories.Abstract;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MoviePerspectives.Repositories.Concrete
{
    public class MovieRepository : IMovieRepository
    {
        private readonly MovieContext _db;
        public MovieRepository(MovieContext db) => _db = db;

        public async Task<IEnumerable<Movie>> GetAllAsync() =>
            await _db.Movies.ToListAsync();

        public async Task<Movie?> GetByIdAsync(int id) =>
            await _db.Movies.FindAsync(id);

        public async Task<Movie> AddAsync(Movie movie)
        {
            _db.Movies.Add(movie);
            await _db.SaveChangesAsync();
            return movie;
        }

        public async Task UpdateAsync(Movie movie)
        {
            _db.Movies.Update(movie);
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var m = await _db.Movies.FindAsync(id);
            if (m is not null)
            {
                _db.Movies.Remove(m);
                await _db.SaveChangesAsync();
            }
        }

        public async Task<bool> ExistsAsync(int id) =>
            await _db.Movies.AnyAsync(m => m.Id == id);
    }
}
