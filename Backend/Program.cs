using MoviePerspectives.Repositories.Abstract;
using MoviePerspectives.Repositories.Concrete;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddCors(o => o.AddDefaultPolicy(p => p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));
// CSV-only repository registration:
builder.Services.AddSingleton<IMovieRepository, CsvMovieRepository>();

var app = builder.Build();
app.MapControllers();
app.Run();