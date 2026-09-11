using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace FinSim.DataAccessLayer.Migrations.ScenarioDb
{
    /// <inheritdoc />
    public partial class Initializescenariodatatable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Scenarios",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Slug = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Nume = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Descriere = table.Column<string>(type: "character varying(600)", maxLength: 600, nullable: false),
                    Dificultate = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    SoldInitial = table.Column<decimal>(type: "numeric", nullable: false),
                    NecesitaCont = table.Column<bool>(type: "boolean", nullable: false),
                    ScorCreditInitial = table.Column<int>(type: "integer", nullable: true),
                    PasiJson = table.Column<string>(type: "text", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Scenarios", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Scenarios_Slug",
                table: "Scenarios",
                column: "Slug",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Scenarios");
        }
    }
}
