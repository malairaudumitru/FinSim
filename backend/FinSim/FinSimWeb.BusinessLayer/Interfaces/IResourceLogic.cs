using FinSim.Domain.Models.Resources;
using FinSim.Domain.Models.Responses;

namespace FinSim.BusinessLayer.Interfaces;

public interface IResourceLogic
{
    ActionResponse CreateVideo(VideoResourceCreateDto data);
    ActionResponse GetVideoList();
    ActionResponse UpdateVideo(int id, VideoResourceCreateDto data);
    ActionResponse DeleteVideo(int id);

    ActionResponse CreatePdf(PdfResourceCreateDto data);
    ActionResponse GetPdfList();
    ActionResponse UpdatePdf(int id, PdfResourceCreateDto data);
    ActionResponse DeletePdf(int id);
}
