using Microsoft.AspNetCore.Mvc;
using MoviePerspectives.Models;
using MoviePerspectives.Repositories.Abstract;

namespace MoviePerspectives.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MovieController : ControllerBase
    {
        private readonly IMovieRepository _movies;
        public MovieController(IMovieRepository movies) => _movies = movies;

        [HttpGet]
        public Task<IEnumerable<Movie>> GetAll() => _movies.GetAllAsync();

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var m = await _movies.GetByIdAsync(id);
            return m == null ? NotFound() : Ok(m);
        }
    }
}
