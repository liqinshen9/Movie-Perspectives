using Microsoft.AspNetCore.Mvc;
using MoviePerspectives.Models;
using MoviePerspectives.Repositories.Abstract;

namespace MoviePerspectives.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository _users;

        public AuthController(IUserRepository users)
        {
            _users = users;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User creds)
        {
            if (await _users.ExistsAsync(creds.Username))
                return BadRequest("Username already taken.");

            await _users.AddAsync(creds);
            return Ok();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User creds)
        {
            var user = await _users.ValidateCredentialsAsync(creds.Username, creds.Password);
            if (user == null)
                return Unauthorized("Invalid username or password.");

            return Ok();
        }
    }
}
