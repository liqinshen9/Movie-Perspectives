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
using Microsoft.EntityFrameworkCore.Diagnostics;

var builder = WebApplication.CreateBuilder(args);

// 1️⃣ DbContext  
if (builder.Environment.IsDevelopment())
{
    builder.Services.AddDbContext<MovieContext>(o =>
        o.UseInMemoryDatabase("MoviePerspectivesDb"));
}
else
{
    builder.Services.AddDbContext<MovieContext>(o =>
        o.UseSqlServer(
          builder.Configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Missing conn string"),
          sql => sql.EnableRetryOnFailure())
        .ConfigureWarnings(w => w.Ignore(RelationalEventId.PendingModelChangesWarning))
    );
}

// 2️⃣ Repositories  
builder.Services.AddScoped<IMovieRepository, EfMovieRepository>();
builder.Services.AddScoped<IReviewRepository, EfReviewRepository>();
builder.Services.AddScoped<IUserRepository, EfUserRepository>();

builder.Services.AddControllers();  
builder.Services.AddCors(o => o.AddDefaultPolicy(b => b
    .AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()
));

var app = builder.Build();

// 3️⃣ Seed  
using (var scope = app.Services.CreateScope())
{
    var ctx = scope.ServiceProvider.GetRequiredService<MovieContext>();
    var env = scope.ServiceProvider.GetRequiredService<IHostEnvironment>();

    if (!env.IsDevelopment())
        ctx.Database.Migrate();
    else
        ctx.Database.EnsureCreated();

    if (!ctx.Movies.Any())
    {
        using var r = new StreamReader("Data/movies.csv");
        using var c = new CsvReader(r, CultureInfo.InvariantCulture);
        ctx.Movies.AddRange(c.GetRecords<Movie>());
    }
    if (!ctx.Users.Any())
    {
        using var r = new StreamReader("Data/users.csv");
        using var c = new CsvReader(r, CultureInfo.InvariantCulture);
        ctx.Users.AddRange(c.GetRecords<User>());
    }
    ctx.SaveChanges();
}

app.UseCors();
app.MapControllers();
app.Run();
