using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using MoviePerspectives.Models;
using MoviePerspectives.Repositories.Abstract;

namespace MoviePerspectives.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository _repo;
        public AuthController(IUserRepository repo) => _repo = repo;

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            if (await _repo.ExistsAsync(user.Username))
                return BadRequest("Username already exists.");

            await _repo.AddAsync(user);
            return Ok();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User creds)
        {
            if (!await _repo.ValidateCredentialsAsync(creds.Username, creds.Password))
                return Unauthorized("Invalid credentials.");

            return Ok();
        }
    }
}
