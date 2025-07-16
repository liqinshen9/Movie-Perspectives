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

        [HttpGet("{username}/followers")]
        public async Task<IActionResult> GetFollowers(string username)
        {
            var list = await _ctx.Follows
                .Where(f => f.FolloweeUsername == username)
                .Select(f => f.FollowerUsername)
                .ToListAsync();
            return Ok(list);
        }

        [HttpGet("{username}/following")]
        public async Task<IActionResult> GetFollowing(string username)
        {
            var list = await _ctx.Follows
                .Where(f => f.FollowerUsername == username)
                .Select(f => f.FolloweeUsername)
                .ToListAsync();
            return Ok(list);
        }

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



        [HttpGet("{username}/private")]
        public async Task<IActionResult> GetPrivate(string username)
        {
            var user = await _ctx.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Username == username);

            if (user == null) return NotFound();

            return Ok(new
            {
                phone = user.Phone,
                email = user.Email,
                occupation = user.Occupation
            });
        }

        [HttpPut("{username}/private")]
        public async Task<IActionResult> SavePrivate(
            string username,
            [FromBody] PrivateInfoDto dto)
        {
            var user = await _ctx.Users
                .FirstOrDefaultAsync(u => u.Username == username);

            if (user == null) return NotFound();

            user.Phone = dto.Phone;
            user.Email = dto.Email;
            user.Occupation = dto.Occupation;

            await _ctx.SaveChangesAsync();
            return NoContent();
        }

        public record PrivateInfoDto(string Phone, string Email, string Occupation);
        
        [HttpGet("{username}/share")]
        public async Task<IActionResult> CheckShare(string username, [FromQuery] string with)
        {
            var exists = await _ctx.Shares
                .AnyAsync(s => s.OwnerUsername == username
                            && s.WithUsername  == with);

            return Ok(new { shared = exists });
        }
        
        [HttpPost("{username}/share")]
        public async Task<IActionResult> ShareWith(string username, [FromQuery] string with)
        {
            if (username == with) return BadRequest("Cannot share with yourself.");

            var already = await _ctx.Shares.FindAsync(username, with);
            if (already != null) return BadRequest("Already shared.");

            _ctx.Shares.Add(new Share {
                OwnerUsername = username,
                WithUsername  = with
            });
            await _ctx.SaveChangesAsync();
            return Ok();
        }

        // DELETE /api/user/{username}/share?with={other}
        [HttpDelete("{username}/share")]
        public async Task<IActionResult> Unshare(string username, [FromQuery] string with)
        {
            var ent = await _ctx.Shares.FindAsync(username, with);
            if (ent == null) return NotFound();

            _ctx.Shares.Remove(ent);
            await _ctx.SaveChangesAsync();
            return NoContent();
        }

    }

}
