using Microsoft.AspNetCore.Mvc;
using MoviePerspectives.Models;
using MoviePerspectives.Repositories.Abstract;

namespace MoviePerspectives.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MovieController : ControllerBase
    {
        private readonly IMovieRepository _repo;
        public MovieController(IMovieRepository r) => _repo = r;

        [HttpGet]
        public Task<List<Movie>> GetAll() => _repo.GetAllAsync();

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var m = await _repo.GetByIdAsync(id);
            return m == null ? NotFound() : Ok(m);
        }

        [HttpPost("reload")]
        public IActionResult ReloadCsv()
        {
            _repo.LoadFromCsv("Data/movies.csv");
            return Ok();
        }
    }

    
}
