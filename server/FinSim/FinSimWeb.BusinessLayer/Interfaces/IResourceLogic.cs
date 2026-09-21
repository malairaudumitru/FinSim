using FinSim.Domain.Models.Resources;
using FinSim.Domain.Models.Responses;

namespace FinSim.BusinessLayer.Interfaces;

public interface IResourceLogic
{
    Task<ActionResponse> CreateVideoAsync(VideoResourceCreateDto data);
    Task<ActionResponse> GetVideoListAsync(string language);
    Task<ActionResponse> UpdateVideoAsync(int id, VideoResourceCreateDto data);
    Task<ActionResponse> DeleteVideoAsync(int id);

    Task<ActionResponse> CreatePdfAsync(PdfResourceCreateDto data);
    Task<ActionResponse> GetPdfListAsync(string language);
    Task<ActionResponse> UpdatePdfAsync(int id, PdfResourceCreateDto data);
    Task<ActionResponse> DeletePdfAsync(int id);
}
