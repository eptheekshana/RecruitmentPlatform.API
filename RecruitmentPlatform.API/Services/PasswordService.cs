using Microsoft.AspNetCore.Identity;
using RecruitmentPlatform.API.Entities;

namespace RecruitmentPlatform.API.Services;

public class PasswordService
{
    private readonly PasswordHasher<User> _hasher = new PasswordHasher<User>();

    public string HashPassword(User user, string password)
    {
        return _hasher.HashPassword(user, password);
    }

    public bool VerifyPassword(User user, string hashedPassword, string providedPassword)
    {
        var result = _hasher.VerifyHashedPassword(user, hashedPassword, providedPassword);
        return result == PasswordVerificationResult.Success;
    }
}
