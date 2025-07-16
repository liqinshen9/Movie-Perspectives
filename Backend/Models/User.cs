using System.ComponentModel.DataAnnotations;

namespace MoviePerspectives.Models
{
    public class User
    {
        [Key]
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string? Introduction { get; set; }

        public ICollection<Follow> Followers { get; set; } = new List<Follow>();
        public ICollection<Follow> Following { get; set; } = new List<Follow>();

         public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? Occupation { get; set; }
    }
}
