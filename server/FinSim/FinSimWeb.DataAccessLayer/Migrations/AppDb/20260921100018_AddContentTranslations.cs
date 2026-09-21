using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FinSim.DataAccessLayer.Migrations.AppDb
{
    /// <inheritdoc />
    public partial class AddContentTranslations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Title",
                table: "VideoResources",
                newName: "TitleRo");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Scenarios",
                newName: "NameRo");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "Scenarios",
                newName: "DescriptionRo");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "PdfResources",
                newName: "TitleRo");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "PdfResources",
                newName: "DescriptionRo");

            migrationBuilder.RenameColumn(
                name: "Message",
                table: "Notifications",
                newName: "MessageRo");

            migrationBuilder.AddColumn<string>(
                name: "TitleEn",
                table: "VideoResources",
                type: "character varying(150)",
                maxLength: 150,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TitleRu",
                table: "VideoResources",
                type: "character varying(150)",
                maxLength: 150,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DescriptionEn",
                table: "Scenarios",
                type: "character varying(600)",
                maxLength: 600,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DescriptionRu",
                table: "Scenarios",
                type: "character varying(600)",
                maxLength: 600,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NameEn",
                table: "Scenarios",
                type: "character varying(150)",
                maxLength: 150,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NameRu",
                table: "Scenarios",
                type: "character varying(150)",
                maxLength: 150,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DescriptionEn",
                table: "PdfResources",
                type: "character varying(600)",
                maxLength: 600,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DescriptionRu",
                table: "PdfResources",
                type: "character varying(600)",
                maxLength: 600,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TitleEn",
                table: "PdfResources",
                type: "character varying(150)",
                maxLength: 150,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TitleRu",
                table: "PdfResources",
                type: "character varying(150)",
                maxLength: 150,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MessageEn",
                table: "Notifications",
                type: "character varying(300)",
                maxLength: 300,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MessageRu",
                table: "Notifications",
                type: "character varying(300)",
                maxLength: 300,
                nullable: true);

            // The system notification created when an admin replies to a contact message had only a Romanian text.
            migrationBuilder.Sql(
                """
                UPDATE "Notifications"
                SET "MessageEn" = 'You received a reply to your message sent to FinSim.',
                    "MessageRu" = 'Ты получил ответ на своё сообщение, отправленное в FinSim.'
                WHERE "MessageRo" = 'Ai primit un răspuns la mesajul tău trimis către FinSim.';
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TitleEn",
                table: "VideoResources");

            migrationBuilder.DropColumn(
                name: "TitleRu",
                table: "VideoResources");

            migrationBuilder.DropColumn(
                name: "DescriptionEn",
                table: "Scenarios");

            migrationBuilder.DropColumn(
                name: "DescriptionRu",
                table: "Scenarios");

            migrationBuilder.DropColumn(
                name: "NameEn",
                table: "Scenarios");

            migrationBuilder.DropColumn(
                name: "NameRu",
                table: "Scenarios");

            migrationBuilder.DropColumn(
                name: "DescriptionEn",
                table: "PdfResources");

            migrationBuilder.DropColumn(
                name: "DescriptionRu",
                table: "PdfResources");

            migrationBuilder.DropColumn(
                name: "TitleEn",
                table: "PdfResources");

            migrationBuilder.DropColumn(
                name: "TitleRu",
                table: "PdfResources");

            migrationBuilder.DropColumn(
                name: "MessageEn",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "MessageRu",
                table: "Notifications");

            migrationBuilder.RenameColumn(
                name: "TitleRo",
                table: "VideoResources",
                newName: "Title");

            migrationBuilder.RenameColumn(
                name: "NameRo",
                table: "Scenarios",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "DescriptionRo",
                table: "Scenarios",
                newName: "Description");

            migrationBuilder.RenameColumn(
                name: "TitleRo",
                table: "PdfResources",
                newName: "Title");

            migrationBuilder.RenameColumn(
                name: "DescriptionRo",
                table: "PdfResources",
                newName: "Description");

            migrationBuilder.RenameColumn(
                name: "MessageRo",
                table: "Notifications",
                newName: "Message");
        }
    }
}
