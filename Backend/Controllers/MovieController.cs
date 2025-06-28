using System.Collections.Generic;
using System.Threading.Tasks;
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
        public MovieController(IMovieRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Movie>>> GetAll()
        {
            var movies = await _repo.GetAllAsync();
            return Ok(movies);
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<Movie>> GetById(int id)
        {
            var movie = await _repo.GetByIdAsync(id);
            if (movie is null) return NotFound();
            return Ok(movie);
        }

        
        [HttpPost]
        public async Task<ActionResult<Movie>> Create(Movie movie)
        {
            var created = await _repo.AddAsync(movie);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _repo.DeleteAsync(id);
            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Movie movie)
        {
            if (id != movie.Id) return BadRequest("ID mismatch");
            if (!await _repo.ExistsAsync(id)) return NotFound();

            await _repo.UpdateAsync(movie);
            return NoContent();
        }
    }
}
