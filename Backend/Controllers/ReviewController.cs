using Microsoft.AspNetCore.Mvc;
using MoviePerspectives.Models;
using MoviePerspectives.Repositories.Abstract;

[ApiController]
[Route("api/[controller]")]
public class ReviewController : ControllerBase
{
    private readonly IReviewRepository _repo;
    public ReviewController(IReviewRepository repo) => _repo = repo;

    [HttpGet("movie/{movieId}")]
    public async Task<IEnumerable<Review>> GetForMovie(int movieId)
        => await _repo.GetAllForMovieAsync(movieId);

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] Review rev)
    {
        await _repo.AddAsync(rev);
        return CreatedAtAction(nameof(GetForMovie), new { movieId = rev.MovieId }, null);
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id, [FromQuery] string user)
    {
        var ok = await _repo.DeleteAsync(id, user);
        return ok ? NoContent() : BadRequest("Cannot delete");
    }
}
