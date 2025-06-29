using Microsoft.AspNetCore.Mvc;
using MoviePerspectives.Repositories.Abstract;

namespace MoviePerspectives.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MovieController : ControllerBase
    {
        private readonly IMovieRepository _repo;
        public MovieController(IMovieRepository repo) => _repo = repo;

        [HttpGet]
        public async Task<IActionResult> Get() =>
            Ok(await _repo.GetAllAsync());
    }
}
