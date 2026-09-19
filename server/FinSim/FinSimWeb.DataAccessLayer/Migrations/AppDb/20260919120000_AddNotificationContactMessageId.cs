using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FinSim.DataAccessLayer.Migrations.AppDb
{
    /// <inheritdoc />
    public partial class AddNotificationContactMessageId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ContactMessageId",
                table: "Notifications",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ContactMessageId",
                table: "Notifications");
        }
    }
}
