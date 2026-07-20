using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RecruitmentPlatform.API.Data;
using RecruitmentPlatform.API.Services;
using System.Text;
using Amazon.S3;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=recruitment-platform.db"));

builder.Services.AddScoped<PasswordService>();
builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<ResumeAnalysisService>();
builder.Services.AddScoped<MatchingService>();
builder.Services.AddScoped<AuditLogService>();

builder.Services.AddSingleton<IAmazonS3>(sp =>
{
    var config = sp.GetRequiredService<IConfiguration>();
    var s3Config = new Amazon.S3.AmazonS3Config
    {
        ServiceURL = config["AWS:ServiceURL"]
    };
    return new Amazon.S3.AmazonS3Client(s3Config);
});

builder.Services.AddScoped<ICloudStorageService, S3CloudStorageService>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "RecruitmentPlatform",
            ValidAudience = builder.Configuration["Jwt:Audience"] ?? "RecruitmentPlatformUsers",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? "recruitment-platform-secret-key-2026"))
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddControllers();

// Add CORS Policy for Frontend (Vite React & Next.js)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000", "http://localhost:5128")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Recruitment Platform API",
        Version = "v1",
        Description = "RESTful APIs for Recruitment and Talent Management Platform with JWT Auth & RBAC"
    });

    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Enter 'Bearer' [space] and then your valid JWT token.\r\n\r\nExample: \"Bearer eyJhbGciOiJIUzI1Ni...\""
    });

    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    await db.Database.EnsureCreatedAsync();
    var passwordService = scope.ServiceProvider.GetRequiredService<PasswordService>();
    await SeedData.SeedAsync(db, passwordService);
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapGet("/", () => Results.Redirect("/index.html"));
app.MapFallbackToFile("index.html");

app.Run();

public partial class Program;
