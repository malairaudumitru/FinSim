using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FinSim.DataAccessLayer.Migrations.ScenarioDb
{
    /// <inheritdoc />
    public partial class AddStresInitialtoScenario : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "StresInitial",
                table: "Scenarios",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "StresInitial",
                table: "Scenarios");
        }
    }
}
