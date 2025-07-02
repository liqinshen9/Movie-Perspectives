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
using System.IO;

var builder = WebApplication.CreateBuilder(args);

// 1) DbContext
builder.Services.AddDbContext<MovieContext>(opts =>
    opts.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Missing DefaultConnection")
    )
);

// 2) Repositories
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

// 3) Migrate & Seed
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

    // ─── Seed Movies ─────────────────────────────
    if (!ctx.Movies.Any())
    {
        var movieCsv = Path.Combine(env.ContentRootPath, "Data", "movies.csv");
        using var r = new StreamReader(movieCsv);
        using var csv = new CsvReader(r, CultureInfo.InvariantCulture);

        // **zero out the Id** so SQL Server will assign a new one
        var movies = csv
            .GetRecords<Movie>()
            .Select(m => {
                m.Id = 0;
                return m;
            })
            .ToList();

        ctx.Movies.AddRange(movies);
    }

    // ─── Seed Users ──────────────────────────────
    if (!ctx.Users.Any())
    {
        var userCsv = Path.Combine(env.ContentRootPath, "Data", "users.csv");
        using var r = new StreamReader(userCsv);
        using var csv = new CsvReader(r, CultureInfo.InvariantCulture);

        // if your User model also has an identity PK, you can zero it here too
        var users = csv
            .GetRecords<User>()
            .Select(u => {
                // if User.Id is an identity, zero it; otherwise omit
                // u.Id = 0;
                return u;
            })
            .ToList();

        ctx.Users.AddRange(users);
    }

    ctx.SaveChanges();
}

app.UseCors();
app.MapControllers();
app.Run();
