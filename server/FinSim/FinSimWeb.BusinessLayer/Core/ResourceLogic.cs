using FinSim.BusinessLayer.Interfaces;
using FinSim.BusinessLayer.Structure;
using FinSim.DataAccessLayer.Context;
using FinSim.Domain.Models.Resources;
using FinSim.Domain.Models.Responses;

namespace FinSim.BusinessLayer.Core;

public class ResourceLogic : ResourceAction, IResourceLogic
{
    public ResourceLogic(AppDbContext context) : base(context) { }

    public async Task<ActionResponse> CreateVideoAsync(VideoResourceCreateDto data)
    {
        var result = await CreateVideoActionAsync(data);
        if (result == false)
            return ActionResponse.BadRequest("Error creating video resource");
        return ActionResponse.Ok("Video resource created successfully");
    }

    public async Task<ActionResponse> GetVideoListAsync()
    {
        var result = await GetVideoListActionAsync();
        return ActionResponse.Ok(data: result);
    }

    public async Task<ActionResponse> UpdateVideoAsync(int id, VideoResourceCreateDto data)
    {
        var result = await UpdateVideoActionAsync(id, data);
        if (result == false)
            return ActionResponse.BadRequest("Error updating video resource");
        return ActionResponse.Ok("Video resource updated successfully");
    }

    public async Task<ActionResponse> DeleteVideoAsync(int id)
    {
        var result = await DeleteVideoActionAsync(id);
        if (result == false)
            return ActionResponse.NotFound("Video resource not found");
        return ActionResponse.Ok("Video resource deleted successfully");
    }

    public async Task<ActionResponse> CreatePdfAsync(PdfResourceCreateDto data)
    {
        var result = await CreatePdfActionAsync(data);
        if (result == false)
            return ActionResponse.BadRequest("Error creating pdf resource");
        return ActionResponse.Ok("Pdf resource created successfully");
    }

    public async Task<ActionResponse> GetPdfListAsync()
    {
        var result = await GetPdfListActionAsync();
        return ActionResponse.Ok(data: result);
    }

    public async Task<ActionResponse> UpdatePdfAsync(int id, PdfResourceCreateDto data)
    {
        var result = await UpdatePdfActionAsync(id, data);
        if (result == false)
            return ActionResponse.BadRequest("Error updating pdf resource");
        return ActionResponse.Ok("Pdf resource updated successfully");
    }

    public async Task<ActionResponse> DeletePdfAsync(int id)
    {
        var result = await DeletePdfActionAsync(id);
        if (result == false)
            return ActionResponse.NotFound("Pdf resource not found");
        return ActionResponse.Ok("Pdf resource deleted successfully");
    }
}
