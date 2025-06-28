using System;
using System.Collections.Generic;
namespace MoviePerspectives.Models
{
    public class Movie
    {
        public int Id { get; set; }
        public string? Title { get; set; }//make it nullable to allow for empty titles
        public string? Director { get; set; }
        public int ReleaseYear { get; set; }
        public string? Genre { get; set; }
        public ICollection<Review>? Reviews { get; set; }
    }
}
