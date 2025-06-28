using Microsoft.EntityFrameworkCore;
using MoviePerspectives.Models;

namespace MoviePerspectives.Context
{
    public class MovieContext : DbContext
    {
        public MovieContext(DbContextOptions<MovieContext> options)
            : base(options) { }

        public DbSet<Movie>  Movies  { get; set; } = default!;
        public DbSet<Review> Reviews { get; set; } = default!;
        public DbSet<User>   Users   { get; set; } = default!;
    }
}
