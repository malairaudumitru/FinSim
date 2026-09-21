using FinSim.Api.Middleware;
using FinSim.BusinessLayer.Interfaces;
using FinSim.Domain.Models.Resources;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FinSim.Api.Controllers;

[ApiController]
[Route("api/resources")]
public class ResourceController : ControllerBase
{
    private readonly IResourceLogic _resourceLogic;

    public ResourceController(IResourceLogic resourceLogic)
    {
        _resourceLogic = resourceLogic;
    }

    [HttpGet("videos")]
    public async Task<IActionResult> GetVideoList()
    {
        var result = await _resourceLogic.GetVideoListAsync(RequestContextHelpers.GetLanguage(HttpContext));
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Data);
    }

    [HttpPost("videos/create")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateVideo([FromBody] VideoResourceCreateDto videoInfo)
    {
        var result = await _resourceLogic.CreateVideoAsync(videoInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }

    [HttpPut("videos/update/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateVideo([FromRoute] int id, [FromBody] VideoResourceCreateDto videoInfo)
    {
        var result = await _resourceLogic.UpdateVideoAsync(id, videoInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }

    [HttpDelete("videos/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteVideo([FromRoute] int id)
    {
        var result = await _resourceLogic.DeleteVideoAsync(id);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }

    [HttpGet("pdfs")]
    public async Task<IActionResult> GetPdfList()
    {
        var result = await _resourceLogic.GetPdfListAsync(RequestContextHelpers.GetLanguage(HttpContext));
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Data);
    }

    [HttpPost("pdfs/upload")]
    [Authorize(Roles = "Admin")]
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
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreatePdf([FromBody] PdfResourceCreateDto pdfInfo)
    {
        var result = await _resourceLogic.CreatePdfAsync(pdfInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }

    [HttpPut("pdfs/update/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdatePdf([FromRoute] int id, [FromBody] PdfResourceCreateDto pdfInfo)
    {
        var result = await _resourceLogic.UpdatePdfAsync(id, pdfInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }

    [HttpDelete("pdfs/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeletePdf([FromRoute] int id)
    {
        var result = await _resourceLogic.DeletePdfAsync(id);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }
}
