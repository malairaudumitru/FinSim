using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FinSim.DataAccessLayer.Migrations.UserDb
{
    /// <inheritdoc />
    public partial class ReplaceZiLunaAnwithDataNasterii : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Password",
                table: "Users",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<DateOnly>(
                name: "DataNasterii",
                table: "Users",
                type: "date",
                nullable: true);

            migrationBuilder.Sql(
                "UPDATE \"Users\" SET \"DataNasterii\" = make_date(\"An\", \"Luna\", \"Zi\") " +
                "WHERE \"An\" IS NOT NULL AND \"Luna\" IS NOT NULL AND \"Zi\" IS NOT NULL;");

            migrationBuilder.DropColumn(
                name: "An",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Luna",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Zi",
                table: "Users");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "An",
                table: "Users",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Luna",
                table: "Users",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Zi",
                table: "Users",
                type: "integer",
                nullable: true);

            migrationBuilder.Sql(
                "UPDATE \"Users\" SET \"An\" = EXTRACT(YEAR FROM \"DataNasterii\"), " +
                "\"Luna\" = EXTRACT(MONTH FROM \"DataNasterii\"), \"Zi\" = EXTRACT(DAY FROM \"DataNasterii\") " +
                "WHERE \"DataNasterii\" IS NOT NULL;");

            migrationBuilder.DropColumn(
                name: "DataNasterii",
                table: "Users");

            migrationBuilder.AlterColumn<string>(
                name: "Password",
                table: "Users",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(50)",
                oldMaxLength: 50);
        }
    }
}
