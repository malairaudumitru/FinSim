using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace FinSim.DataAccessLayer.Migrations.ResourceDb
{
    /// <inheritdoc />
    public partial class Initializeresourcedatatables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PdfResources",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Titlu = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Descriere = table.Column<string>(type: "character varying(600)", maxLength: 600, nullable: false),
                    Fisier = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    Tema = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PdfResources", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "VideoResources",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    YoutubeId = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Titlu = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Sursa = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Tema = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VideoResources", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PdfResources");

            migrationBuilder.DropTable(
                name: "VideoResources");
        }
    }
}
