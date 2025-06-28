using System;
namespace MoviePerspectives.Models
{
    public class Review
    {
        public int Id { get; set; }
        public int MovieId { get; set; }
        public string? Content { get; set; }
        public int Rating { get; set; } 
        public DateTime ReviewDate { get; set; }
    }
}