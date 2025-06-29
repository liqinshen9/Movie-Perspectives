namespace MoviePerspectives.Repositories.Concrete
{
    using MoviePerspectives.Models;
    using MoviePerspectives.Repositories.Abstract;
    using Microsoft.AspNetCore.Hosting;
    using CsvHelper;
    using System.Globalization;
    using System.IO;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Collections.Generic;

    public class CsvMovieRepository : IMovieRepository
    {
        private readonly List<Movie> _movies;
        public CsvMovieRepository(IWebHostEnvironment env)
        {
            var path = Path.Combine(env.ContentRootPath, "Data", "movies.csv");
            using var reader = new StreamReader(path);
            using var csv    = new CsvReader(reader, CultureInfo.InvariantCulture);
            _movies = csv.GetRecords<Movie>().ToList();
        }

        public Task<IEnumerable<Movie>> GetAllAsync()
            => Task.FromResult<IEnumerable<Movie>>(_movies);
    }
}