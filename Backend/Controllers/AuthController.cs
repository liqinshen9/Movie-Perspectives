using Microsoft.AspNetCore.Mvc;
using MoviePerspectives.Models;
using MoviePerspectives.Repositories.Abstract;

namespace MoviePerspectives.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository _users;
        public AuthController(IUserRepository users) => _users = users;

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User u)
        {
            if (await _users.ExistsAsync(u.Username))
                return BadRequest("Username exists");
            await _users.AddAsync(u);
            return Ok();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User u)
        {
            if (!await _users.ValidateCredentialsAsync(u.Username, u.Password))
                return Unauthorized();
            return Ok();
        }
    }
}
