// Program.cs
using CsvHelper;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using MoviePerspectives.Context;
using MoviePerspectives.Models;
using MoviePerspectives.Repositories.Abstract;
using MoviePerspectives.Repositories.Concrete;
using System.Globalization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<MovieContext>((serviceProvider, options) =>
{
    var env = serviceProvider.GetRequiredService<IHostEnvironment>();

    if (env.IsDevelopment())
    {
        options.UseInMemoryDatabase("MoviePerspectivesDb");
    }
    else
    {
        var conn = builder.Configuration
                         .GetConnectionString("DefaultConnection")
                  ?? throw new InvalidOperationException("Missing DefaultConnection");
        options.UseSqlServer(conn, sqlOpts => 
                sqlOpts.EnableRetryOnFailure())
               .ConfigureWarnings(w => 
                w.Ignore(RelationalEventId.PendingModelChangesWarning));
    }
});

builder.Services.AddScoped<IMovieRepository, EfMovieRepository>();
builder.Services.AddScoped<IReviewRepository, EfReviewRepository>();
builder.Services.AddScoped<IUserRepository, EfUserRepository>();

builder.Services.AddControllers();
builder.Services.AddCors(o => o.AddDefaultPolicy(b => 
    b.AllowAnyOrigin()
     .AllowAnyHeader()
     .AllowAnyMethod()
));

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var ctx = scope.ServiceProvider.GetRequiredService<MovieContext>();
    var env = scope.ServiceProvider.GetRequiredService<IHostEnvironment>();

    if (env.IsDevelopment())
    {
        ctx.Database.EnsureCreated();
    }
    else
    {
        ctx.Database.Migrate();
    }

    if (!ctx.Movies.Any())
    {
        var movieCsv = Path.Combine(env.ContentRootPath, "Data", "movies.csv");
        using var r = new StreamReader(movieCsv);
        using var csv = new CsvReader(r, CultureInfo.InvariantCulture);
        ctx.Movies.AddRange(csv.GetRecords<Movie>());
    }

    if (!ctx.Users.Any())
    {
        var userCsv = Path.Combine(env.ContentRootPath, "Data", "users.csv");
        using var r = new StreamReader(userCsv);
        using var csv = new CsvReader(r, CultureInfo.InvariantCulture);
        ctx.Users.AddRange(csv.GetRecords<User>());
    }

    ctx.SaveChanges();
}

app.UseCors();
app.MapControllers();
app.Run();
