using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FinSim.DataAccessLayer.Migrations.ScenarioDb
{
    /// <inheritdoc />
    public partial class Convertscenariodifficultytoenum : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                "ALTER TABLE \"Scenarios\" ALTER COLUMN \"Dificultate\" TYPE integer USING 0;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Dificultate",
                table: "Scenarios",
                type: "character varying(30)",
                maxLength: 30,
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer");
        }
    }
}
