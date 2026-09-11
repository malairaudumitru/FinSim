using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FinSim.DataAccessLayer.Migrations.LeaderboardDb
{
    /// <inheritdoc />
    public partial class MakeUserIdrequiredanduniqueaddFKtoUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "Leaderboard",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Leaderboard_UserId",
                table: "Leaderboard",
                column: "UserId",
                unique: true);

            migrationBuilder.Sql(
                "ALTER TABLE \"Leaderboard\" ADD CONSTRAINT \"FK_Leaderboard_Users_UserId\" " +
                "FOREIGN KEY (\"UserId\") REFERENCES \"Users\" (\"Id\") ON DELETE CASCADE;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                "ALTER TABLE \"Leaderboard\" DROP CONSTRAINT \"FK_Leaderboard_Users_UserId\";");

            migrationBuilder.DropIndex(
                name: "IX_Leaderboard_UserId",
                table: "Leaderboard");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "Leaderboard",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");
        }
    }
}
