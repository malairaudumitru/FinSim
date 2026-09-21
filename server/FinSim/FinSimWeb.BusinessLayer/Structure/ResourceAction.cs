using System.Text.RegularExpressions;
using FinSim.BusinessLayer.Core;
using FinSim.DataAccessLayer.Context;
using FinSim.Domain.Entities.Resources;
using FinSim.Domain.Models.Resources;
using Microsoft.EntityFrameworkCore;

namespace FinSim.BusinessLayer.Structure;

public class ResourceAction
{
    protected readonly AppDbContext _context;

    public ResourceAction(AppDbContext context)
    {
        _context = context;
    }

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

    protected async Task<bool> CreateVideoActionAsync(VideoResourceCreateDto data)
    {
        var videoResourceEntity = new VideoResourceEntity
        {
            YoutubeId = ExtractYoutubeId(data.YoutubeId),
            TitleRo = data.TitleRo,
            TitleEn = NullIfBlank(data.TitleEn),
            TitleRu = NullIfBlank(data.TitleRu),
            Source = data.Source,
            Theme = data.Theme
        };

        try
        {
            _context.Add(videoResourceEntity);
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    protected async Task<List<VideoResourceInfoDto>> GetVideoListActionAsync(string language)
    {
        return await _context.VideoResources
            .Where(x => x.IsDeleted == false)
            .Select(videoResourceEntity => MapToInfoDto(videoResourceEntity, language))
            .ToListAsync();
    }

    protected async Task<bool> UpdateVideoActionAsync(int id, VideoResourceCreateDto data)
    {
        var videoResourceEntity = await _context.VideoResources.FirstOrDefaultAsync(x => x.Id == id);
        if (videoResourceEntity == null || videoResourceEntity.IsDeleted)
            return false;

        videoResourceEntity.YoutubeId = ExtractYoutubeId(data.YoutubeId);
        videoResourceEntity.TitleRo = data.TitleRo;
        videoResourceEntity.TitleEn = NullIfBlank(data.TitleEn);
        videoResourceEntity.TitleRu = NullIfBlank(data.TitleRu);
        videoResourceEntity.Source = data.Source;
        videoResourceEntity.Theme = data.Theme;

        try
        {
            _context.VideoResources.Update(videoResourceEntity);
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    protected async Task<bool> DeleteVideoActionAsync(int id)
    {
        var videoResourceEntity = await _context.VideoResources.FirstOrDefaultAsync(x => x.Id == id);
        if (videoResourceEntity == null)
            return false;

        try
        {
            videoResourceEntity.IsDeleted = true;
            _context.VideoResources.Update(videoResourceEntity);
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    protected async Task<bool> CreatePdfActionAsync(PdfResourceCreateDto data)
    {
        var pdfResourceEntity = new PdfResourceEntity
        {
            TitleRo = data.TitleRo,
            TitleEn = NullIfBlank(data.TitleEn),
            TitleRu = NullIfBlank(data.TitleRu),
            DescriptionRo = data.DescriptionRo,
            DescriptionEn = NullIfBlank(data.DescriptionEn),
            DescriptionRu = NullIfBlank(data.DescriptionRu),
            FilePath = data.FilePath,
            Theme = data.Theme
        };

        try
        {
            _context.Add(pdfResourceEntity);
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    protected async Task<List<PdfResourceInfoDto>> GetPdfListActionAsync(string language)
    {
        return await _context.PdfResources
            .Where(x => x.IsDeleted == false)
            .Select(pdfResourceEntity => MapToInfoDto(pdfResourceEntity, language))
            .ToListAsync();
    }

    protected async Task<bool> UpdatePdfActionAsync(int id, PdfResourceCreateDto data)
    {
        var pdfResourceEntity = await _context.PdfResources.FirstOrDefaultAsync(x => x.Id == id);
        if (pdfResourceEntity == null || pdfResourceEntity.IsDeleted)
            return false;

        pdfResourceEntity.TitleRo = data.TitleRo;
        pdfResourceEntity.TitleEn = NullIfBlank(data.TitleEn);
        pdfResourceEntity.TitleRu = NullIfBlank(data.TitleRu);
        pdfResourceEntity.DescriptionRo = data.DescriptionRo;
        pdfResourceEntity.DescriptionEn = NullIfBlank(data.DescriptionEn);
        pdfResourceEntity.DescriptionRu = NullIfBlank(data.DescriptionRu);
        pdfResourceEntity.FilePath = data.FilePath;
        pdfResourceEntity.Theme = data.Theme;

        try
        {
            _context.PdfResources.Update(pdfResourceEntity);
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    protected async Task<bool> DeletePdfActionAsync(int id)
    {
        var pdfResourceEntity = await _context.PdfResources.FirstOrDefaultAsync(x => x.Id == id);
        if (pdfResourceEntity == null)
            return false;

        try
        {
            pdfResourceEntity.IsDeleted = true;
            _context.PdfResources.Update(pdfResourceEntity);
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    private static string? NullIfBlank(string? value) => string.IsNullOrWhiteSpace(value) ? null : value;

    private static VideoResourceInfoDto MapToInfoDto(VideoResourceEntity videoResourceEntity, string language) => new()
    {
        Id = videoResourceEntity.Id,
        YoutubeId = videoResourceEntity.YoutubeId,
        Title = AppLanguage.Pick(language, videoResourceEntity.TitleRo, videoResourceEntity.TitleEn, videoResourceEntity.TitleRu),
        TitleRo = videoResourceEntity.TitleRo,
        TitleEn = videoResourceEntity.TitleEn,
        TitleRu = videoResourceEntity.TitleRu,
        Source = videoResourceEntity.Source,
        Theme = videoResourceEntity.Theme,
        IsDeleted = videoResourceEntity.IsDeleted
    };

    private static PdfResourceInfoDto MapToInfoDto(PdfResourceEntity pdfResourceEntity, string language) => new()
    {
        Id = pdfResourceEntity.Id,
        Title = AppLanguage.Pick(language, pdfResourceEntity.TitleRo, pdfResourceEntity.TitleEn, pdfResourceEntity.TitleRu),
        Description = AppLanguage.Pick(language, pdfResourceEntity.DescriptionRo, pdfResourceEntity.DescriptionEn, pdfResourceEntity.DescriptionRu),
        TitleRo = pdfResourceEntity.TitleRo,
        TitleEn = pdfResourceEntity.TitleEn,
        TitleRu = pdfResourceEntity.TitleRu,
        DescriptionRo = pdfResourceEntity.DescriptionRo,
        DescriptionEn = pdfResourceEntity.DescriptionEn,
        DescriptionRu = pdfResourceEntity.DescriptionRu,
        FilePath = pdfResourceEntity.FilePath,
        Theme = pdfResourceEntity.Theme,
        IsDeleted = pdfResourceEntity.IsDeleted
    };
}
