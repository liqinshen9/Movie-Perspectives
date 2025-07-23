using System;

namespace MoviePerspectives.Models
{
    public class ChatMessage
    {
        public int Id { get; set; }
        public string FromUsername { get; set; } = null!;
        public string ToUsername { get; set; } = null!;
        public string Text { get; set; } = null!;
        public DateTime SentAt { get; set; }
    }
}
