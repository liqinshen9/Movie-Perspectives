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
        public MovieController(IMovieRepository repo) => _repo = repo;

        [HttpGet]
        public Task<IEnumerable<Movie>> GetAll()
            => _repo.GetAllAsync();
    }
}