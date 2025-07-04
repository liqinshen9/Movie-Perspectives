using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace MoviePerspectives.Models
{
    public class Review
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey(nameof(Movie))]
        public int MovieId { get; set; }

        [JsonIgnore]
        public Movie? Movie { get; set; }

        [Required]
        public string Username { get; set; } = default!;

        [Required]
        public int Rating { get; set; }

        [Required]
        public string Text { get; set; } = default!;

        [Required]
        public DateTime ReviewDate { get; set; } = DateTime.UtcNow;

        public int? ParentId { get; set; }

        [JsonIgnore]
        [ForeignKey(nameof(ParentId))]
        public Review? Parent { get; set; }

        [JsonIgnore]
        public ICollection<Review> Replies { get; set; } = new List<Review>();
    }
}
