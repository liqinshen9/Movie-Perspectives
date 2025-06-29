namespace MoviePerspectives.Repositories.Abstract
{
    using MoviePerspectives.Models;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    public interface IMovieRepository
    {
        Task<IEnumerable<Movie>> GetAllAsync();
    }
}