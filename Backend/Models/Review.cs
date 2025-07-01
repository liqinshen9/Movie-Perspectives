namespace MoviePerspectives.Models
{
    public class Review
    {
        public int Id { get; set; }
        public string Username { get; set; } = null!;    // FK to User.Username
        public int MovieId { get; set; }
        public Movie Movie { get; set; } = null!;
        public int Rating { get; set; }
        public string Text { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
    }
}
