using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace FinSim.DataAccessLayer.Migrations.UserDb
{
    /// <inheritdoc />
    public partial class Initializeuserdatatable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Nume = table.Column<string>(type: "character varying(15)", maxLength: 15, nullable: false),
                    Prenume = table.Column<string>(type: "character varying(15)", maxLength: 15, nullable: false),
                    Email = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: false),
                    Rol = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    DataInregistrare = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ScenariiFinalizate = table.Column<int>(type: "integer", nullable: false),
                    ScorTotal = table.Column<int>(type: "integer", nullable: false),
                    Zi = table.Column<int>(type: "integer", nullable: true),
                    Luna = table.Column<int>(type: "integer", nullable: true),
                    An = table.Column<int>(type: "integer", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
