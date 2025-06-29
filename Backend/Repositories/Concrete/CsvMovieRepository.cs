using System.IO;
using Microsoft.Extensions.Hosting;
using MoviePerspectives.Models;
using MoviePerspectives.Repositories.Abstract;

namespace MoviePerspectives.Repositories.Concrete
{
    public class CsvMovieRepository : IMovieRepository
    {
        private readonly string _csvPath;

        public CsvMovieRepository(IHostEnvironment env)
        {
            // Data/movies.csv lives next to your project file,
            // so ContentRootPath points at the project folder.
            _csvPath = Path.Combine(env.ContentRootPath, "Data", "movies.csv");
        }

        public async Task<IEnumerable<Movie>> GetAllAsync()
        {
            using var reader = new StreamReader(_csvPath);
            using var csv    = new CsvHelper.CsvReader(reader, System.Globalization.CultureInfo.InvariantCulture);
            var records = csv.GetRecords<Movie>().ToList();
            return await Task.FromResult(records);
        }
    }
}
