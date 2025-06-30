using MoviePerspectives.Repositories.Abstract;
using MoviePerspectives.Repositories.Concrete;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddScoped<IMovieRepository, CsvMovieRepository>();
builder.Services.AddScoped<IUserRepository, MoviePerspectives.Repositories.Concrete.CsvUserRepository>();
builder.Services.AddScoped<IReviewRepository, CsvReviewRepository>();

builder.Services.AddControllers();
builder.Services.AddCors(o => o.AddDefaultPolicy(b => b
    .AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()
));

var app = builder.Build();
app.UseCors();
app.MapControllers();
app.Run();
