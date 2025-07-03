using Microsoft.EntityFrameworkCore;
using MoviePerspectives.Context;
using MoviePerspectives.Models;
using MoviePerspectives.Repositories.Abstract;
using System.IO;               // for StreamReader
using CsvHelper;               // for CsvReader
using System.Globalization;  

namespace MoviePerspectives.Repositories.Concrete
{
    public class EfMovieRepository : IMovieRepository
    {
        private readonly MovieContext _ctx;
        public EfMovieRepository(MovieContext ctx) => _ctx = ctx;

        public Task<List<Movie>> GetAllAsync() =>
            _ctx.Movies.AsNoTracking().ToListAsync();

        public Task<Movie?> GetByIdAsync(int id) =>
            _ctx.Movies.FindAsync(id).AsTask();

        public void LoadFromCsv(string path)
        {
            using var reader = new StreamReader(path);
            using var csv    = new CsvReader(reader, CultureInfo.InvariantCulture);
            var records      = csv.GetRecords<Movie>().ToList();

            // wipe and re-seed
            _ctx.Movies.RemoveRange(_ctx.Movies);
            _ctx.Movies.AddRange(records);
            _ctx.SaveChanges();
        }
    }
}
