using Microsoft.EntityFrameworkCore;
using MoviePerspectives.Models;

namespace MoviePerspectives.Context
{
    public class MovieContext : DbContext
    {
        public MovieContext(DbContextOptions<MovieContext> opts) : base(opts) {}

        public DbSet<Movie> Movies { get; set; } = default!;
        public DbSet<User> Users { get; set; } = default!;
        public DbSet<Review> Reviews { get; set; } = default!;
        public DbSet<Follow> Follows { get; set; } = default!;
        public DbSet<ChatMessage> ChatMessages { get; set; } = default!;
        public DbSet<Share> Shares { get; set; } = null!;
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Share>()
            .HasKey(s => new { s.OwnerUsername, s.WithUsername });

            modelBuilder.Entity<Review>()
                .HasOne(r => r.Parent)
                .WithMany(r => r.Replies)
                .HasForeignKey(r => r.ParentId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Follow>()
                .HasKey(f => new { f.FollowerUsername, f.FolloweeUsername });

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
