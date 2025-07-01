using System.ComponentModel.DataAnnotations;

namespace MoviePerspectives.Models
{
    public class User
    {
        [Key]
        public string Username { get; set; } = null!;

        // This matches your CSV header "Password"
        public string Password { get; set; } = null!;
    }
}
