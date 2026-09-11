using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FinSim.DataAccessLayer.Migrations.ScenarioHistoryDb
{
    /// <inheritdoc />
    public partial class AddforeignkeystoUserandScenario : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_ScenarioHistories_UserId",
                table: "ScenarioHistories",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ScenarioHistories_ScenarioId",
                table: "ScenarioHistories",
                column: "ScenarioId");

            migrationBuilder.Sql(
                "ALTER TABLE \"ScenarioHistories\" ADD CONSTRAINT \"FK_ScenarioHistories_Users_UserId\" " +
                "FOREIGN KEY (\"UserId\") REFERENCES \"Users\" (\"Id\") ON DELETE CASCADE;");

            migrationBuilder.Sql(
                "ALTER TABLE \"ScenarioHistories\" ADD CONSTRAINT \"FK_ScenarioHistories_Scenarios_ScenarioId\" " +
                "FOREIGN KEY (\"ScenarioId\") REFERENCES \"Scenarios\" (\"Id\") ON DELETE CASCADE;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                "ALTER TABLE \"ScenarioHistories\" DROP CONSTRAINT \"FK_ScenarioHistories_Users_UserId\";");

            migrationBuilder.Sql(
                "ALTER TABLE \"ScenarioHistories\" DROP CONSTRAINT \"FK_ScenarioHistories_Scenarios_ScenarioId\";");

            migrationBuilder.DropIndex(
                name: "IX_ScenarioHistories_UserId",
                table: "ScenarioHistories");

            migrationBuilder.DropIndex(
                name: "IX_ScenarioHistories_ScenarioId",
                table: "ScenarioHistories");
        }
    }
}
