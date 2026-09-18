using System.Text.RegularExpressions;
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
            Title = data.Title,
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

    protected async Task<List<VideoResourceInfoDto>> GetVideoListActionAsync()
    {
        return await _context.VideoResources
            .Where(x => x.IsDeleted == false)
            .Select(videoResourceEntity => MapToInfoDto(videoResourceEntity))
            .ToListAsync();
    }

    protected async Task<bool> UpdateVideoActionAsync(int id, VideoResourceCreateDto data)
    {
        var videoResourceEntity = await _context.VideoResources.FirstOrDefaultAsync(x => x.Id == id);
        if (videoResourceEntity == null || videoResourceEntity.IsDeleted)
            return false;

        videoResourceEntity.YoutubeId = ExtractYoutubeId(data.YoutubeId);
        videoResourceEntity.Title = data.Title;
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
            Title = data.Title,
            Description = data.Description,
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

    protected async Task<List<PdfResourceInfoDto>> GetPdfListActionAsync()
    {
        return await _context.PdfResources
            .Where(x => x.IsDeleted == false)
            .Select(pdfResourceEntity => MapToInfoDto(pdfResourceEntity))
            .ToListAsync();
    }

    protected async Task<bool> UpdatePdfActionAsync(int id, PdfResourceCreateDto data)
    {
        var pdfResourceEntity = await _context.PdfResources.FirstOrDefaultAsync(x => x.Id == id);
        if (pdfResourceEntity == null || pdfResourceEntity.IsDeleted)
            return false;

        pdfResourceEntity.Title = data.Title;
        pdfResourceEntity.Description = data.Description;
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

    private static VideoResourceInfoDto MapToInfoDto(VideoResourceEntity videoResourceEntity) => new()
    {
        Id = videoResourceEntity.Id,
        YoutubeId = videoResourceEntity.YoutubeId,
        Title = videoResourceEntity.Title,
        Source = videoResourceEntity.Source,
        Theme = videoResourceEntity.Theme,
        IsDeleted = videoResourceEntity.IsDeleted
    };

    private static PdfResourceInfoDto MapToInfoDto(PdfResourceEntity pdfResourceEntity) => new()
    {
        Id = pdfResourceEntity.Id,
        Title = pdfResourceEntity.Title,
        Description = pdfResourceEntity.Description,
        FilePath = pdfResourceEntity.FilePath,
        Theme = pdfResourceEntity.Theme,
        IsDeleted = pdfResourceEntity.IsDeleted
    };
}
