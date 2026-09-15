using FinSim.BusinessLayer.Interfaces;
using FinSim.BusinessLayer.Structure;
using FinSim.DataAccessLayer.Context;
using FinSim.Domain.Models.Resources;
using FinSim.Domain.Models.Responses;

namespace FinSim.BusinessLayer.Core;

public class ResourceLogic : ResourceAction, IResourceLogic
{
    public ResourceLogic(AppDbContext context) : base(context) { }

    public ActionResponse CreateVideo(VideoResourceCreateDto data)
    {
        var result = CreateVideoAction(data);
        if (result == false)
            return ActionResponse.BadRequest("Error creating video resource");
        return ActionResponse.Ok("Video resource created successfully");
    }

    public ActionResponse GetVideoList()
    {
        var result = GetVideoListAction();
        return ActionResponse.Ok(data: result);
    }

    public ActionResponse UpdateVideo(int id, VideoResourceCreateDto data)
    {
        var result = UpdateVideoAction(id, data);
        if (result == false)
            return ActionResponse.BadRequest("Error updating video resource");
        return ActionResponse.Ok("Video resource updated successfully");
    }

    public ActionResponse DeleteVideo(int id)
    {
        var result = DeleteVideoAction(id);
        if (result == false)
            return ActionResponse.NotFound("Video resource not found");
        return ActionResponse.Ok("Video resource deleted successfully");
    }

    public ActionResponse CreatePdf(PdfResourceCreateDto data)
    {
        var result = CreatePdfAction(data);
        if (result == false)
            return ActionResponse.BadRequest("Error creating pdf resource");
        return ActionResponse.Ok("Pdf resource created successfully");
    }

    public ActionResponse GetPdfList()
    {
        var result = GetPdfListAction();
        return ActionResponse.Ok(data: result);
    }

    public ActionResponse UpdatePdf(int id, PdfResourceCreateDto data)
    {
        var result = UpdatePdfAction(id, data);
        if (result == false)
            return ActionResponse.BadRequest("Error updating pdf resource");
        return ActionResponse.Ok("Pdf resource updated successfully");
    }

    public ActionResponse DeletePdf(int id)
    {
        var result = DeletePdfAction(id);
        if (result == false)
            return ActionResponse.NotFound("Pdf resource not found");
        return ActionResponse.Ok("Pdf resource deleted successfully");
    }
}
