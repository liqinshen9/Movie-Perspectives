using System;

namespace MoviePerspectives.Models
{
    public class Share
    {
        public string OwnerUsername { get; set; } = null!;
        public string WithUsername  { get; set; } = null!;
        public DateTime SharedAt    { get; set; } = DateTime.UtcNow;
    }
}
