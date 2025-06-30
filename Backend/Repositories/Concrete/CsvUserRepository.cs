using CsvHelper;
using System.Globalization;
using MoviePerspectives.Models;
using MoviePerspectives.Repositories.Abstract;

namespace MoviePerspectives.Repositories.Concrete
{
    public class CsvUserRepository : IUserRepository
    {
        private readonly string _path;

        public CsvUserRepository(IWebHostEnvironment env)
        {
            _path = Path.Combine(env.ContentRootPath, "Data", "users.csv");
        }

        public async Task<bool> ExistsAsync(string username)
        {
            var users = await ReadAllAsync();
            return users.Any(u => u.Username.Equals(username, StringComparison.OrdinalIgnoreCase));
        }

        public async Task AddAsync(User user)
        {
            var users = await ReadAllAsync();
            users.Add(user);

            using var writer = new StreamWriter(_path, false);
            using var csv = new CsvWriter(writer, CultureInfo.InvariantCulture);
            await csv.WriteRecordsAsync(users);
        }

        public async Task<User?> ValidateCredentialsAsync(string username, string password)
        {
            var users = await ReadAllAsync();
            return users.FirstOrDefault(u =>
                u.Username.Equals(username, StringComparison.OrdinalIgnoreCase)
                && u.Password == password);
        }

        private async Task<List<User>> ReadAllAsync()
        {
            if (!File.Exists(_path))
                return new List<User>();

            using var reader = new StreamReader(_path);
            using var csv = new CsvReader(reader, CultureInfo.InvariantCulture);
            var records = csv.GetRecords<User>();
            return records.ToList();
        }
    }
}
