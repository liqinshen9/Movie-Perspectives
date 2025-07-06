using System.Text.Json.Serialization;

namespace MoviePerspectives.Models
{
    public class Follow
    {

        public string FollowerUsername { get; set; } = null!;

        [JsonIgnore]
        public User? Follower { get; set; }

        public string FolloweeUsername { get; set; } = null!;

        [JsonIgnore]
        public User? Followee { get; set; }
    }
}
