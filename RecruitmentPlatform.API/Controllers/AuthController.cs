using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecruitmentPlatform.API.Data;
using RecruitmentPlatform.API.DTOs;
using RecruitmentPlatform.API.Entities;
using RecruitmentPlatform.API.Services;
using System.Security.Claims;

namespace RecruitmentPlatform.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly PasswordService _passwordService;
    private readonly TokenService _tokenService;
    private readonly AuditLogService _auditLogService;

    public AuthController(
        ApplicationDbContext context,
        PasswordService passwordService,
        TokenService tokenService,
        AuditLogService auditLogService)
    {
        _context = context;
        _passwordService = passwordService;
        _tokenService = tokenService;
        _auditLogService = auditLogService;
    }

    /// <summary>
    /// Register a new user account (Candidate, Recruiter, or Admin).
    /// </summary>
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterDto dto)
    {
        if (await _context.Users.AnyAsync(u => u.Email.ToLower() == dto.Email.ToLower()))
        {
            return BadRequest(new { message = "User with this email address already exists." });
        }

        var allowedRoles = new[] { "Candidate", "Recruiter", "Admin" };
        var role = allowedRoles.Contains(dto.Role, StringComparer.OrdinalIgnoreCase) ? dto.Role : "Candidate";

        var user = new User
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = dto.Email,
            Role = role,
            OrganizationId = dto.OrganizationId
        };

        user.PasswordHash = _passwordService.HashPassword(user, dto.Password);
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // If registered as a candidate, automatically create candidate profile entity
        if (role.Equals("Candidate", StringComparison.OrdinalIgnoreCase))
        {
            var candidate = new Candidate
            {
                UserId = user.UserId,
                Skills = string.Empty,
                Bio = string.Empty,
                ResumeUrl = string.Empty,
                ExperienceLevel = "Entry"
            };
            _context.Candidates.Add(candidate);
            await _context.SaveChangesAsync();
        }

        await _auditLogService.LogAsync("User Registered", $"New {user.Role} registered: {user.Email}", user.UserId);

        var token = _tokenService.GenerateToken(user);

        return Ok(new AuthResponseDto
        {
            Token = token,
            UserId = user.UserId,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Role = user.Role,
            OrganizationId = user.OrganizationId
        });
    }

    /// <summary>
    /// Authenticate user credentials and return a valid JWT Bearer token.
    /// </summary>
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto dto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == dto.Email.ToLower());
        if (user == null)
        {
            return Unauthorized(new { message = "Invalid email or password." });
        }

        bool isValidPassword = _passwordService.VerifyPassword(user, user.PasswordHash, dto.Password);
        if (!isValidPassword)
        {
            return Unauthorized(new { message = "Invalid email or password." });
        }

        await _auditLogService.LogAsync("User Login", $"User logged in: {user.Email}", user.UserId);

        var token = _tokenService.GenerateToken(user);

        return Ok(new AuthResponseDto
        {
            Token = token,
            UserId = user.UserId,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Role = user.Role,
            OrganizationId = user.OrganizationId
        });
    }

    /// <summary>
    /// Get authenticated user details based on current JWT token.
    /// </summary>
    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<AuthResponseDto>> GetCurrentUser()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized();
        }

        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            return NotFound();
        }

        return Ok(new AuthResponseDto
        {
            Token = string.Empty, // Current token is already valid
            UserId = user.UserId,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Role = user.Role,
            OrganizationId = user.OrganizationId
        });
    }
}
