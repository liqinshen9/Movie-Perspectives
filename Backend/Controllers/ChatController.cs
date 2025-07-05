using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MoviePerspectives.Context;
using MoviePerspectives.Models;

namespace MoviePerspectives.Controllers
{
    [ApiController]
    [Route("api/chat")]
    public class ChatController : ControllerBase
    {
        private readonly MovieContext _ctx;
        public ChatController(MovieContext ctx) => _ctx = ctx;

        // GET /api/chat/{withUser}?me={currentUser}
        [HttpGet("{withUser}")]
        public async Task<IActionResult> GetHistory(
            string withUser,
            [FromQuery] string? me
        )
        {
            if (string.IsNullOrEmpty(me))
                return BadRequest("me is required");

            var msgs = await _ctx.ChatMessages
                .Where(m =>
                   (m.FromUsername == me!     && m.ToUsername == withUser) ||
                   (m.FromUsername == withUser && m.ToUsername == me!)
                )
                .OrderBy(m => m.SentAt)
                .ToListAsync();

            return Ok(msgs);
        }

        // POST /api/chat
        [HttpPost]
        public async Task<IActionResult> PostMessage([FromBody] ChatMessage dto)
        {
            // you might want to validate dto.FromUsername, dto.ToUsername not null...

            dto.Id     = 0;                   // EF will pick new
            dto.SentAt = DateTime.UtcNow;     // server‐side timestamp

            await _ctx.ChatMessages.AddAsync(dto);
            await _ctx.SaveChangesAsync();

            return CreatedAtAction(
              nameof(GetHistory),
              new { withUser = dto.ToUsername, me = dto.FromUsername },
              dto
            );
        }
    }
}
