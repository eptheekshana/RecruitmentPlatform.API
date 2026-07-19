using Microsoft.EntityFrameworkCore;
using RecruitmentPlatform.API.Entities;
using RecruitmentPlatform.API.Services;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace RecruitmentPlatform.API.Data;

public static class SeedData
{
    public static async Task SeedAsync(ApplicationDbContext context, PasswordService passwordService)
    {
        // Ensure database is created
        await context.Database.EnsureCreatedAsync();

        if (await context.Users.AnyAsync())
        {
            return; // DB already seeded
        }

        // Seed Organization
        var org = new Organization
        {
            Name = "Tech Solutions Inc.",
            Description = "A global leader in enterprise software development.",
            Location = "Colombo, Sri Lanka",
            Industry = "Information Technology"
        };
        context.Organizations.Add(org);
        await context.SaveChangesAsync();

        // Seed Users
        var adminUser = new User
        {
            FirstName = "System",
            LastName = "Admin",
            Email = "admin@techsolutions.com",
            Role = "Admin",
            OrganizationId = org.OrganizationId
        };
        adminUser.PasswordHash = passwordService.HashPassword(adminUser, "Admin123!");

        var recruiterUser = new User
        {
            FirstName = "Alice",
            LastName = "Smith",
            Email = "recruiter@techsolutions.com",
            Role = "Recruiter",
            OrganizationId = org.OrganizationId
        };
        recruiterUser.PasswordHash = passwordService.HashPassword(recruiterUser, "Recruiter123!");

        var candidateUser = new User
        {
            FirstName = "Bob",
            LastName = "Developer",
            Email = "bob@example.com",
            Role = "Candidate"
        };
        candidateUser.PasswordHash = passwordService.HashPassword(candidateUser, "Candidate123!");

        context.Users.AddRange(adminUser, recruiterUser, candidateUser);
        await context.SaveChangesAsync();

        // Seed Candidate
        var candidate = new Candidate
        {
            UserId = candidateUser.UserId,
            ResumeUrl = "https://example.com/resumes/bob_cv.pdf",
            Skills = "C#, ASP.NET Core, EF Core, SQLite",
            Bio = "Enthusiastic full-stack developer with experience in C# and web development.",
            ExperienceLevel = "Mid"
        };
        context.Candidates.Add(candidate);
        await context.SaveChangesAsync();

        // Seed Job Posting
        var job = new JobPosting
        {
            Title = "Associate Software Engineer - .NET",
            Description = "We are looking for a passionate Associate Software Engineer to join our .NET development team.",
            Requirements = "C#, ASP.NET Core, Relational Databases (SQLite/SQL Server)",
            Department = "Engineering",
            Location = "Colombo / Remote",
            IsActive = true,
            PostedDate = DateTime.UtcNow.AddDays(-5),
            RecruiterId = recruiterUser.UserId
        };
        context.JobPostings.Add(job);
        await context.SaveChangesAsync();

        // Seed Application
        var app = new Application
        {
            CandidateId = candidate.CandidateId,
            JobId = job.JobId,
            Status = "Applied",
            AIScore = 78.5m,
            AppliedDate = DateTime.UtcNow.AddDays(-2),
            CoverLetter = "I am excited to apply for the Associate Software Engineer role at Tech Solutions. I have strong knowledge in ASP.NET Core."
        };
        context.Applications.Add(app);
        await context.SaveChangesAsync();

        // Seed Interview Schedule
        var interview = new InterviewSchedule
        {
            ApplicationId = app.ApplicationId,
            InterviewerId = recruiterUser.UserId,
            ScheduledTime = DateTime.UtcNow.AddDays(2),
            MeetingLink = "https://meet.google.com/abc-defg-hij",
            InterviewType = "HR Screening",
            Status = "Scheduled"
        };
        context.InterviewSchedules.Add(interview);
        await context.SaveChangesAsync();
    }
}
