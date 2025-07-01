// Program.cs
using CsvHelper;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore.Diagnostics;
using MoviePerspectives.Context;
using MoviePerspectives.Models;
using MoviePerspectives.Repositories.Abstract;
using MoviePerspectives.Repositories.Concrete;
using System.Globalization;

var builder = WebApplication.CreateBuilder(args);

// 1️⃣ DbContext  
builder.Services.AddDbContext<MovieContext>(opts =>
{
    if (builder.Environment.IsDevelopment())
    {
        // Dev: in‐memory DB (no Azure connection needed)
        opts.UseInMemoryDatabase("MoviePerspectivesDb");
    }
    else
    {
        // Prod: Azure SQL
        var conn = builder.Configuration.GetConnectionString("DefaultConnection")
                   ?? throw new InvalidOperationException("Missing conn string");
        opts.UseSqlServer(conn, sql => sql.EnableRetryOnFailure())
            .ConfigureWarnings(w => 
                w.Ignore(RelationalEventId.PendingModelChangesWarning)
            );
    }
});

// 2️⃣ Repositories  
builder.Services.AddScoped<IMovieRepository, EfMovieRepository>();
builder.Services.AddScoped<IReviewRepository, EfReviewRepository>();
builder.Services.AddScoped<IUserRepository, EfUserRepository>();

builder.Services.AddControllers();
builder.Services.AddCors(o => o.AddDefaultPolicy(b => b
    .AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()
));

var app = builder.Build();

// 3️⃣ Auto‐migrate (prod) & seed (both)
using (var scope = app.Services.CreateScope())
{
    var ctx = scope.ServiceProvider.GetRequiredService<MovieContext>();
    var env = scope.ServiceProvider.GetRequiredService<IHostEnvironment>();

    if (env.IsDevelopment())
    {
        // Create tables fresh in InMemory
        ctx.Database.EnsureCreated();
    }
    else
    {
        // Apply any pending migrations on Azure SQL
        ctx.Database.Migrate();
    }

    // ─── Seed Movies ─────────────────────────────
    if (!ctx.Movies.Any())
    {
        var movieCsv = Path.Combine(env.ContentRootPath, "Data", "movies.csv");
        using var mReader = new StreamReader(movieCsv);
        using var mCsv    = new CsvReader(mReader, CultureInfo.InvariantCulture);
        ctx.Movies.AddRange(mCsv.GetRecords<Movie>());
    }

    // ─── Seed Users ──────────────────────────────
    if (!ctx.Users.Any())
    {
        var userCsv = Path.Combine(env.ContentRootPath, "Data", "users.csv");
        using var uReader = new StreamReader(userCsv);
        using var uCsv    = new CsvReader(uReader, CultureInfo.InvariantCulture);
        ctx.Users.AddRange(uCsv.GetRecords<User>());
    }

    ctx.SaveChanges();
}

app.UseCors();
app.MapControllers();
app.Run();
