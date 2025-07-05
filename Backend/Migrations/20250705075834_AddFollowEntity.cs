using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MoviePerspectives.Migrations
{
    /// <inheritdoc />
    public partial class AddFollowEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Follows",
                columns: table => new
                {
                    FollowerUsername = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    FolloweeUsername = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Follows", x => new { x.FollowerUsername, x.FolloweeUsername });
                    table.ForeignKey(
                        name: "FK_Follows_Users_FolloweeUsername",
                        column: x => x.FolloweeUsername,
                        principalTable: "Users",
                        principalColumn: "Username",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Follows_Users_FollowerUsername",
                        column: x => x.FollowerUsername,
                        principalTable: "Users",
                        principalColumn: "Username",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Follows_FolloweeUsername",
                table: "Follows",
                column: "FolloweeUsername");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Follows");
        }
    }
}
