using Microsoft.EntityFrameworkCore;
using MoviePerspectives.Models;

namespace MoviePerspectives.Context
{
    public class MovieContext : DbContext
    {
        public MovieContext(DbContextOptions<MovieContext> opts) : base(opts) { }

        public DbSet<Movie>  Movies  { get; set; } = default!;
        public DbSet<User>   Users   { get; set; } = default!;
        public DbSet<Review> Reviews { get; set; } = default!;
        public DbSet<Follow> Follows { get; set; } = default!;
        public DbSet<ChatMessage> ChatMessages { get; set; } = default!;
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ─── Review parent/replies ─────────────────────────────────────────
            modelBuilder.Entity<Review>()
                .HasOne(r => r.Parent)
                .WithMany(r => r.Replies)
                .HasForeignKey(r => r.ParentId)
                .OnDelete(DeleteBehavior.Restrict);

            // ─── Follow entity ──────────────────────────────────────────────────
            modelBuilder.Entity<Follow>()
                .HasKey(f => new { f.FollowerUsername, f.FolloweeUsername });

            // One side Restrict to avoid multiple cascade paths
            modelBuilder.Entity<Follow>()
                .HasOne(f => f.Follower)
                .WithMany(u => u.Following)
                .HasForeignKey(f => f.FollowerUsername)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Follow>()
                .HasOne(f => f.Followee)
                .WithMany(u => u.Followers)
                .HasForeignKey(f => f.FolloweeUsername)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
