using System.Text.RegularExpressions;
using FinSim.DataAccessLayer.Context;
using FinSim.Domain.Entities.Resources;
using FinSim.Domain.Models.Resources;

namespace FinSim.BusinessLayer.Structure;

public class ResourceAction
{
    private readonly ResourceDbContext _context = new();

    private static readonly Regex YoutubeUrlPattern = new(
        @"(?:youtube\.com/watch\?v=|youtube\.com/embed/|youtu\.be/|youtube\.com/shorts/)([a-zA-Z0-9_-]{6,})",
        RegexOptions.Compiled);

    private static string ExtractYoutubeId(string input)
    {
        var trimmed = input.Trim();

        var match = YoutubeUrlPattern.Match(trimmed);
        if (match.Success)
            return match.Groups[1].Value;

        if (Uri.TryCreate(trimmed, UriKind.Absolute, out var uri))
        {
            var query = System.Web.HttpUtility.ParseQueryString(uri.Query);
            var v = query.Get("v");
            if (!string.IsNullOrEmpty(v))
                return v;
        }

        return trimmed;
    }

    protected bool CreateVideoAction(VideoResourceCreateDto data)
    {
        var videoResourceEntity = new VideoResourceEntity
        {
            YoutubeId = ExtractYoutubeId(data.YoutubeId),
            Titlu = data.Titlu,
            Sursa = data.Sursa,
            Tema = data.Tema
        };

        try
        {
            _context.Add(videoResourceEntity);
            _context.SaveChanges();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    protected List<VideoResourceInfoDto> GetVideoListAction()
    {
        return _context.VideoResources
            .Where(x => x.IsDeleted == false)
            .Select(videoResourceEntity => MapToInfoDto(videoResourceEntity))
            .ToList();
    }

    protected bool UpdateVideoAction(int id, VideoResourceCreateDto data)
    {
        var videoResourceEntity = _context.VideoResources.Find(id);
        if (videoResourceEntity == null || videoResourceEntity.IsDeleted)
            return false;

        videoResourceEntity.YoutubeId = ExtractYoutubeId(data.YoutubeId);
        videoResourceEntity.Titlu = data.Titlu;
        videoResourceEntity.Sursa = data.Sursa;
        videoResourceEntity.Tema = data.Tema;

        try
        {
            _context.VideoResources.Update(videoResourceEntity);
            _context.SaveChanges();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    protected bool DeleteVideoAction(int id)
    {
        var videoResourceEntity = _context.VideoResources.Find(id);
        if (videoResourceEntity == null)
            return false;

        try
        {
            videoResourceEntity.IsDeleted = true;
            _context.VideoResources.Update(videoResourceEntity);
            _context.SaveChanges();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    protected bool CreatePdfAction(PdfResourceCreateDto data)
    {
        var pdfResourceEntity = new PdfResourceEntity
        {
            Titlu = data.Titlu,
            Descriere = data.Descriere,
            Fisier = data.Fisier,
            Tema = data.Tema
        };

        try
        {
            _context.Add(pdfResourceEntity);
            _context.SaveChanges();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    protected List<PdfResourceInfoDto> GetPdfListAction()
    {
        return _context.PdfResources
            .Where(x => x.IsDeleted == false)
            .Select(pdfResourceEntity => MapToInfoDto(pdfResourceEntity))
            .ToList();
    }

    protected bool UpdatePdfAction(int id, PdfResourceCreateDto data)
    {
        var pdfResourceEntity = _context.PdfResources.Find(id);
        if (pdfResourceEntity == null || pdfResourceEntity.IsDeleted)
            return false;

        pdfResourceEntity.Titlu = data.Titlu;
        pdfResourceEntity.Descriere = data.Descriere;
        pdfResourceEntity.Fisier = data.Fisier;
        pdfResourceEntity.Tema = data.Tema;

        try
        {
            _context.PdfResources.Update(pdfResourceEntity);
            _context.SaveChanges();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    protected bool DeletePdfAction(int id)
    {
        var pdfResourceEntity = _context.PdfResources.Find(id);
        if (pdfResourceEntity == null)
            return false;

        try
        {
            pdfResourceEntity.IsDeleted = true;
            _context.PdfResources.Update(pdfResourceEntity);
            _context.SaveChanges();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    private static VideoResourceInfoDto MapToInfoDto(VideoResourceEntity videoResourceEntity) => new()
    {
        Id = videoResourceEntity.Id,
        YoutubeId = videoResourceEntity.YoutubeId,
        Titlu = videoResourceEntity.Titlu,
        Sursa = videoResourceEntity.Sursa,
        Tema = videoResourceEntity.Tema,
        IsDeleted = videoResourceEntity.IsDeleted
    };

    private static PdfResourceInfoDto MapToInfoDto(PdfResourceEntity pdfResourceEntity) => new()
    {
        Id = pdfResourceEntity.Id,
        Titlu = pdfResourceEntity.Titlu,
        Descriere = pdfResourceEntity.Descriere,
        Fisier = pdfResourceEntity.Fisier,
        Tema = pdfResourceEntity.Tema,
        IsDeleted = pdfResourceEntity.IsDeleted
    };
}
