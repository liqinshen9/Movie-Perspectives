// Backend/Controllers/UserController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MoviePerspectives.Context;
using MoviePerspectives.Models;

namespace MoviePerspectives.Controllers
{
    [ApiController]
    [Route("api/user")]
    public class UserController : ControllerBase
    {
        private readonly MovieContext _ctx;
        public UserController(MovieContext ctx) => _ctx = ctx;

        // GET /api/user/{username}/followers
        [HttpGet("{username}/followers")]
        public async Task<IActionResult> GetFollowers(string username)
        {
            var list = await _ctx.Follows
                .Where(f => f.FolloweeUsername == username)
                .Select(f => f.FollowerUsername)
                .ToListAsync();
            return Ok(list);
        }

        // GET /api/user/{username}/following
        [HttpGet("{username}/following")]
        public async Task<IActionResult> GetFollowing(string username)
        {
            var list = await _ctx.Follows
                .Where(f => f.FollowerUsername == username)
                .Select(f => f.FolloweeUsername)
                .ToListAsync();
            return Ok(list);
        }

        // POST /api/user/{username}/follow
        [HttpPost("{username}/follow")]
        public async Task<IActionResult> Follow(string username, [FromBody] FollowDto dto)
        {
            if (dto.FolloweeUsername != username)
                return BadRequest("Username mismatch.");
            if (await _ctx.Follows.FindAsync(dto.FollowerUsername, dto.FolloweeUsername) != null)
                return BadRequest("Already following.");

            _ctx.Follows.Add(new Follow
            {
                FollowerUsername = dto.FollowerUsername,
                FolloweeUsername = dto.FolloweeUsername
            });
            await _ctx.SaveChangesAsync();
            return Ok();
        }

        // DELETE /api/user/{username}/follow
        [HttpDelete("{username}/follow")]
        public async Task<IActionResult> Unfollow(string username, [FromBody] FollowDto dto)
        {
            if (dto.FolloweeUsername != username)
                return BadRequest("Username mismatch.");

            var ent = await _ctx.Follows.FindAsync(dto.FollowerUsername, dto.FolloweeUsername);
            if (ent == null) return NotFound();

            _ctx.Follows.Remove(ent);
            await _ctx.SaveChangesAsync();
            return NoContent();
        }

        public class FollowDto
        {
            public string FollowerUsername { get; set; } = default!;
            public string FolloweeUsername { get; set; } = default!;
        }

    
        [HttpGet("{username}/introduction")]
        public async Task<IActionResult> GetIntroduction(string username)
        {
            var user = await _ctx.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Username == username);

            if (user == null) return NotFound();
            return Ok(new { introduction = user.Introduction });
        }

        // ← NEW: PUT /api/user/{username}/introduction
        [HttpPut("{username}/introduction")]
        public async Task<IActionResult> SetIntroduction(string username, [FromBody] IntroductionDto dto)
        {
            var user = await _ctx.Users.FindAsync(username);
            if (user == null) return NotFound();

            user.Introduction = dto.Introduction;
            await _ctx.SaveChangesAsync();

            return NoContent();
        }

        public record IntroductionDto(string Introduction);
    }
}
