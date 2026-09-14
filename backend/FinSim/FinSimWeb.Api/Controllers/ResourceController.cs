using FinSim.BusinessLayer;
using FinSim.BusinessLayer.Interfaces;
using FinSim.Domain.Models.Resources;
using Microsoft.AspNetCore.Mvc;

namespace FinSim.Api.Controllers;

[ApiController]
[Route("api/resources")]
public class ResourceController : ControllerBase
{
    private readonly IResourceLogic _resourceLogic;

    public ResourceController()
    {
        var bl = new BusinessLogic();
        _resourceLogic = bl.GetResourceLogic();
    }

    [HttpGet("videos")]
    public IActionResult GetVideoList()
    {
        var result = _resourceLogic.GetVideoList();
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Data);
    }

    [HttpPost("videos/create")]
    public IActionResult CreateVideo([FromBody] VideoResourceCreateDto videoInfo)
    {
        var result = _resourceLogic.CreateVideo(videoInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }

    [HttpPut("videos/update/{id}")]
    public IActionResult UpdateVideo([FromRoute] int id, [FromBody] VideoResourceCreateDto videoInfo)
    {
        var result = _resourceLogic.UpdateVideo(id, videoInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }

    [HttpDelete("videos/{id}")]
    public IActionResult DeleteVideo([FromRoute] int id)
    {
        var result = _resourceLogic.DeleteVideo(id);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }

    [HttpGet("pdfs")]
    public IActionResult GetPdfList()
    {
        var result = _resourceLogic.GetPdfList();
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Data);
    }

    [HttpPost("pdfs/upload")]
    [RequestSizeLimit(20_000_000)]
    public async Task<IActionResult> UploadPdf(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded");

        var extension = Path.GetExtension(file.FileName);
        if (!string.Equals(extension, ".pdf", StringComparison.OrdinalIgnoreCase) ||
            !string.Equals(file.ContentType, "application/pdf", StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest("Only PDF files are allowed");
        }

        var uploadsDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "pdfs");
        Directory.CreateDirectory(uploadsDir);

        var fileName = $"{Guid.NewGuid()}.pdf";
        var filePath = Path.Combine(uploadsDir, fileName);

        await using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return Ok(new { url = $"/uploads/pdfs/{fileName}" });
    }

    [HttpPost("pdfs/create")]
    public IActionResult CreatePdf([FromBody] PdfResourceCreateDto pdfInfo)
    {
        var result = _resourceLogic.CreatePdf(pdfInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }

    [HttpPut("pdfs/update/{id}")]
    public IActionResult UpdatePdf([FromRoute] int id, [FromBody] PdfResourceCreateDto pdfInfo)
    {
        var result = _resourceLogic.UpdatePdf(id, pdfInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }

    [HttpDelete("pdfs/{id}")]
    public IActionResult DeletePdf([FromRoute] int id)
    {
        var result = _resourceLogic.DeletePdf(id);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }
}
