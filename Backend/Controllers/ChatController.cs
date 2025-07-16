using Microsoft.AspNetCore.Mvc;
using MoviePerspectives.Models;
using MoviePerspectives.Repositories.Abstract;

namespace MoviePerspectives.Controllers
{
    [ApiController]
    [Route("api/chat")]
    public class ChatController : ControllerBase
    {
        private readonly IChatRepository _repo;
        public ChatController(IChatRepository repo) => _repo = repo;

        [HttpGet("{withUser}")]
        public async Task<IActionResult> GetHistory(
            string withUser,
            [FromQuery] string? me
        )
        {
            if (string.IsNullOrEmpty(me))
                return BadRequest("me query‐param is required");

            var conv = await _repo.GetConversationAsync(me, withUser);
            return Ok(conv);
        }

        [HttpPost]
        public async Task<IActionResult> PostMessage([FromBody] ChatMessage dto)
        {
            if (string.IsNullOrEmpty(dto.FromUsername) || string.IsNullOrEmpty(dto.ToUsername))
                return BadRequest("FromUsername and ToUsername are required");

            // **Only added this line** to stamp the real send time
            dto.SentAt = DateTime.UtcNow;

            var saved = await _repo.AddAsync(dto);
            return CreatedAtAction(
                nameof(GetHistory),
                new { withUser = saved.ToUsername, me = saved.FromUsername },
                saved
            );
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> RecallMessage(int id, [FromQuery] string? me)
        {
            if (string.IsNullOrEmpty(me))
                return BadRequest("me query-param is required");

            var msg = await _repo.GetByIdAsync(id);
            if (msg == null)
                return NotFound();

            if (msg.FromUsername != me)
                return Forbid();

            await _repo.DeleteAsync(id);
            return NoContent();
        }
    }
}
