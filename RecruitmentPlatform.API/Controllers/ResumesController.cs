using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using RecruitmentPlatform.API.Services;
using RecruitmentPlatform.API.Data;
using Microsoft.EntityFrameworkCore;
// using Microsoft.AspNetCore.Authorization; // Uncomment once auth is active

namespace RecruitmentPlatform.API.Controllers;

[Route("api/[controller]")]
[ApiController]
// [Authorize] // Uncomment to enforce secure access
public class ResumesController : ControllerBase
{
    private readonly ICloudStorageService _cloudStorageService;
    private readonly ApplicationDbContext _context;

    public ResumesController(ICloudStorageService cloudStorageService, ApplicationDbContext context)
    {
        _cloudStorageService = cloudStorageService;
        _context = context;
    }

    [HttpPost("upload")]
    public async Task<IActionResult> UploadResume(IFormFile file, [FromQuery] int candidateId)
    {
        // Note: In a real system, we would get the candidateId from the authenticated user's claims
        
        var candidate = await _context.Candidates.FindAsync(candidateId);
        if (candidate == null)
            return NotFound("Candidate not found.");

        try
        {
            var objectKey = await _cloudStorageService.UploadResumeAsync(file, candidateId);
            
            // Save the secure object key to the database, not the public URL
            candidate.ResumeUrl = objectKey;
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Resume uploaded successfully securely.", FileKey = objectKey });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred during file upload: {ex.Message}");
        }
    }

    [HttpGet("download")]
    public async Task<IActionResult> GetResumeUrl([FromQuery] int candidateId)
    {
        var candidate = await _context.Candidates.FindAsync(candidateId);
        if (candidate == null || string.IsNullOrEmpty(candidate.ResumeUrl))
            return NotFound("Candidate or resume not found.");

        try
        {
            // Generate a temporarily signed URL for secure, limited-time access
            var url = await _cloudStorageService.GeneratePresignedUrlAsync(candidate.ResumeUrl, 15);
            return Ok(new { Url = url });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred generating the secure URL: {ex.Message}");
        }
    }
}
