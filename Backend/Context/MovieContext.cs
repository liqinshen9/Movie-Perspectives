using Microsoft.EntityFrameworkCore;
using MoviePerspectives.Models;

namespace MoviePerspectives.Context
{
    public class MovieContext : DbContext
    {
        public MovieContext(DbContextOptions<MovieContext> opts) : base(opts) { }
        public DbSet<Movie> Movies { get; set; } = default!;
        public DbSet<User> Users { get; set; } = default!;
        public DbSet<Review> Reviews { get; set; } = default!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Review>()
                .HasOne(r => r.Parent)
                .WithMany(r => r.Replies)
                .HasForeignKey(r => r.ParentId)
                .OnDelete(DeleteBehavior.Restrict);
        }
        
    }
}


