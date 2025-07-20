using CsvHelper;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using MoviePerspectives.Context;
using MoviePerspectives.Models;
using MoviePerspectives.Repositories.Abstract;
using MoviePerspectives.Repositories.Concrete;
using System.Globalization;
using System.IO;
using System.Linq;

var builder = WebApplication.CreateBuilder(args);
var env     = builder.Environment;

if (env.IsEnvironment("Test"))
{
    builder.Services.AddDbContext<MovieContext>(opts =>
        opts.UseInMemoryDatabase("TestDb"));
}
else
{
    builder.Services.AddDbContext<MovieContext>(opts =>
        opts.UseSqlServer(
            builder.Configuration
                   .GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Missing DefaultConnection")
        )
    );
}

builder.Services.AddScoped<IMovieRepository, EfMovieRepository>();
builder.Services.AddScoped<IReviewRepository, EfReviewRepository>();
builder.Services.AddScoped<IUserRepository, EfUserRepository>();
builder.Services.AddScoped<IFollowRepository, EfFollowRepository>();
builder.Services.AddScoped<IChatRepository, EfChatRepository>();

builder.Services.AddControllers();
builder.Services.AddCors(o => o.AddDefaultPolicy(b =>
    b.AllowAnyOrigin()
     .AllowAnyHeader()
     .AllowAnyMethod()
));
builder.Services.AddAuthentication(/* … */);
builder.Services.AddAuthorization();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var ctx = scope.ServiceProvider.GetRequiredService<MovieContext>();

    if (env.IsEnvironment("Test"))
    {
      
        ctx.Database.EnsureCreated();
    }
    else if (env.IsDevelopment())
    {
        ctx.Database.EnsureCreated();
    }
    else
    {
        ctx.Database.Migrate();
    }

    if (!env.IsEnvironment("Test") && !ctx.Movies.Any())
    {
        ctx.Database.ExecuteSqlRaw("DBCC CHECKIDENT ('[Movies]', RESEED, 0);");

        var movieCsv = Path.Combine(env.ContentRootPath, "Data", "movies.csv");
        using var reader = new StreamReader(movieCsv);
        using var csv    = new CsvReader(reader, CultureInfo.InvariantCulture);

        var movies = csv
            .GetRecords<Movie>()
            .Select(m => { m.Id = 0; return m; })
            .ToList();

        ctx.Movies.AddRange(movies);
        ctx.SaveChanges();
    }
}

app.UseRouting();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
