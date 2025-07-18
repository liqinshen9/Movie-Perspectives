#if DEBUG
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MoviePerspectives.Context;
using System.Linq;
using System.Threading.Tasks;

namespace MoviePerspectives.Controllers
{
    [ApiController]
    [Route("api/testing")]
    public class TestingController : ControllerBase
    {
        private readonly MovieContext _db;
        public TestingController(MovieContext db) => _db = db;

        /// <summary>
        /// Deletes any review whose Username begins with "dtuser_"
        /// so E2E tests can clean up after themselves.
        /// </summary>
        [HttpPost("cleanup-test-reviews")]
        public async Task<IActionResult> CleanupTestReviews()
        {
            var toDelete = await _db.Reviews
                .Where(r => r.Username.StartsWith("dtuser_"))
                .ToListAsync();

            if (toDelete.Any())
            {
                _db.Reviews.RemoveRange(toDelete);
                await _db.SaveChangesAsync();
            }

            return Ok(new { deleted = toDelete.Count });
        }
    }
}
#endif
