using Microsoft.EntityFrameworkCore;
using MoviePerspectives.Context;
using MoviePerspectives.Models;
using MoviePerspectives.Repositories.Abstract;

namespace MoviePerspectives.Repositories.Concrete
{
    public class EfMovieRepository : IMovieRepository
    {
        private readonly MovieContext _ctx;
        public EfMovieRepository(MovieContext ctx) => _ctx = ctx;

        public Task<List<Movie>> GetAllAsync() =>
            _ctx.Movies.AsNoTracking().ToListAsync();

        public Task<Movie?> GetByIdAsync(int id) =>
            _ctx.Movies.FindAsync(id).AsTask();
    }
}
