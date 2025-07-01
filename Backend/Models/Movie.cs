namespace MoviePerspectives.Models
{
    public class Movie
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public DateTime Release { get; set; }
        public string PhotoUrl { get; set; } = null!;
        public string Introduction { get; set; } = null!;

        public List<Review> Reviews { get; set; } = new();
    }
}
