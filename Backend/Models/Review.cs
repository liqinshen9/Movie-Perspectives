using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MoviePerspectives.Models
{
    public class Review
    {
        [Key]
        public int      Id         { get; set; }
        [ForeignKey("Movies")]
        public int      MovieId    { get; set; }
        [Required] public string   Username   { get; set; } = default!;
        [Required] public int      Rating     { get; set; }
        [Required] public string   Text       { get; set; } = default!;
        [Required] public DateTime ReviewDate { get; set; } = DateTime.UtcNow;
    }
}
