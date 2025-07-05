// Backend/Models/Follow.cs
using System.Text.Json.Serialization;

namespace MoviePerspectives.Models
{
    public class Follow
    {
        // who is doing the following
        public string FollowerUsername { get; set; } = null!;

        [JsonIgnore]
        public User? Follower { get; set; }

        // who is being followed
        public string FolloweeUsername { get; set; } = null!;

        [JsonIgnore]
        public User? Followee { get; set; }
    }
}
