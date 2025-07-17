using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MoviePerspectives.Migrations
{
    /// <inheritdoc />
    public partial class Add_Country_To_Movie : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "country",
                table: "Movies",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "country",
                table: "Movies");
        }
    }
}
