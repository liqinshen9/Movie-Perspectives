using System;
using System.ComponentModel.DataAnnotations;

namespace MoviePerspectives.Models
{
    public class Movie
    {
        [Key]
        public int Id { get; set; }
        [Required] public string Title { get; set; } = default!;
        [Required] public DateTime Release { get; set; }
        [Required] public string PhotoUrl { get; set; } = default!;
        [Required] public string Introduction { get; set; } = default!;
        [Required] public string   country  { get; set; } = default!;
    }
}
