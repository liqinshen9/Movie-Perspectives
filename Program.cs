using System;                            
using Microsoft.EntityFrameworkCore;     
using MoviePerspectives.Context;        
using MoviePerspectives.Models;   
using MoviePerspectives.Repositories.Abstract;
using MoviePerspectives.Repositories.Concrete;       

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddScoped<IMovieRepository, MovieRepository>();
builder.Services.AddScoped<IReviewRepository, ReviewRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();


builder.Services.AddCors(o => o.AddDefaultPolicy(p => p
    .SetIsOriginAllowed(origin => new Uri(origin).Host == "localhost")
    .AllowAnyHeader()
    .AllowAnyOrigin()
));


if (builder.Environment.IsDevelopment())
{
    builder.Services.AddDbContext<MovieContext>(opts =>
        opts.UseInMemoryDatabase("MovieDB"));
}
else
{
    builder.Services.AddDbContext<MovieContext>(opts =>
        opts.UseSqlServer(
            builder.Configuration.GetConnectionString("MovieContext")
            ?? throw new InvalidOperationException("Connection string 'MovieContext' not found.")
        ));
}


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.MapControllers();

app.Run();
