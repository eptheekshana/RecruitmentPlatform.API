using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace RecruitmentPlatform.API.Services;

public class S3CloudStorageService : ICloudStorageService
{
    private readonly IAmazonS3 _s3Client;
    private readonly IConfiguration _configuration;
    private readonly ILogger<S3CloudStorageService> _logger;
    private readonly string _bucketName;

    public S3CloudStorageService(IAmazonS3 s3Client, IConfiguration configuration, ILogger<S3CloudStorageService> logger)
    {
        _s3Client = s3Client;
        _configuration = configuration;
        _logger = logger;
        _bucketName = _configuration["AWS:BucketName"] ?? throw new ArgumentNullException("AWS:BucketName is missing in configuration");
    }

    public async Task<string> UploadResumeAsync(IFormFile file, int candidateId)
    {
        if (file == null || file.Length == 0)
            throw new ArgumentException("File is empty.");

        // Strict file type validation
        var allowedExtensions = new[] { ".pdf", ".doc", ".docx" };
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowedExtensions.Contains(extension))
            throw new InvalidOperationException("Invalid file type. Only PDF and DOCX files are allowed.");

        // Strict file size validation (max 5MB)
        long maxSizeInBytes = 5 * 1024 * 1024;
        if (file.Length > maxSizeInBytes)
            throw new InvalidOperationException("File size exceeds the 5MB limit.");

        // Generate isolated object key to prevent traversal attacks
        var objectKey = $"resumes/candidate_{candidateId}/{Guid.NewGuid()}{extension}";

        try
        {
            using var stream = file.OpenReadStream();
            var putRequest = new PutObjectRequest
            {
                BucketName = _bucketName,
                Key = objectKey,
                InputStream = stream,
                ContentType = file.ContentType,
                // Apply strict server-side encryption
                ServerSideEncryptionMethod = ServerSideEncryptionMethod.AES256
            };

            var response = await _s3Client.PutObjectAsync(putRequest);

            if (response.HttpStatusCode == System.Net.HttpStatusCode.OK)
            {
                _logger.LogInformation($"Successfully uploaded {file.FileName} to S3 bucket {_bucketName} as {objectKey} with AES256 encryption.");
                return objectKey;
            }
            
            throw new Exception($"Failed to upload file to S3. Status code: {response.HttpStatusCode}");
        }
        catch (AmazonS3Exception ex)
        {
            _logger.LogError(ex, "AWS S3 Exception occurred while uploading a resume.");
            throw;
        }
    }

    public async Task<string> GeneratePresignedUrlAsync(string objectKey, double expirationMinutes = 15)
    {
        if (string.IsNullOrEmpty(objectKey))
            throw new ArgumentException("Object key is required.");

        try
        {
            var request = new GetPreSignedUrlRequest
            {
                BucketName = _bucketName,
                Key = objectKey,
                Expires = DateTime.UtcNow.AddMinutes(expirationMinutes)
            };

            string url = await _s3Client.GetPreSignedURLAsync(request);
            return url;
        }
        catch (AmazonS3Exception ex)
        {
            _logger.LogError(ex, "AWS S3 Exception occurred while generating presigned URL.");
            throw;
        }
    }
}
