using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MoviePerspectives.Migrations
{
    /// <inheritdoc />
    public partial class AddParentToReview : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Add ParentId column to existing Reviews table
            migrationBuilder.AddColumn<int>(
                name: "ParentId",
                table: "Reviews",
                type: "int",
                nullable: true);

            // Create index on ParentId for faster lookup
            migrationBuilder.CreateIndex(
                name: "IX_Reviews_ParentId",
                table: "Reviews",
                column: "ParentId");

            // Add foreign key from Reviews.ParentId to Reviews.Id
            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_Reviews_ParentId",
                table: "Reviews",
                column: "ParentId",
                principalTable: "Reviews",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Drop the foreign key and index, then remove the column
            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_Reviews_ParentId",
                table: "Reviews");

            migrationBuilder.DropIndex(
                name: "IX_Reviews_ParentId",
                table: "Reviews");

            migrationBuilder.DropColumn(
                name: "ParentId",
                table: "Reviews");
        }
    }
}
