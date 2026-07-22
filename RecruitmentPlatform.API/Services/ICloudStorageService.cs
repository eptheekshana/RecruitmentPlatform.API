using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace RecruitmentPlatform.API.Services;

public interface ICloudStorageService
{
    Task<string> UploadResumeAsync(IFormFile file, int candidateId);
    Task<string> GeneratePresignedUrlAsync(string objectKey, double expirationMinutes = 15);
}
