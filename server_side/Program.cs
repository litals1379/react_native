using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using MongoDB.Driver;
using Server_Side.DAL;
using Server_Side.BL;
using Server_Side.Services;
using System.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.OpenApi.Models;

namespace Server_Side
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add controllers and Swagger
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "Story Generator API",
                    Version = "v1"
                });
            });

            // Add CORS policy
            builder.Services.AddCors(p =>
                p.AddPolicy("corspolicy", build =>
                    build.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));

            // MongoDB Client
            builder.Services.AddSingleton<IMongoClient>(sp =>
                new MongoClient(builder.Configuration.GetConnectionString("MongoDB")));

            // SQL Server connection
            builder.Services.AddScoped<DBservices>(provider =>
                new DBservices(builder.Configuration.GetConnectionString("SqlServer"))
            );

            // Cloudinary settings
            builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("CloudinarySettings"));

            // Add other DB services
            builder.Services.AddScoped<UserDBservices>();
            builder.Services.AddScoped<StoryDBservices>();

            // ✅ Register Gemini service
            builder.Services.AddScoped<IGeminiService, GeminiService>();

            // Logging
            builder.Logging.AddConsole();

            var app = builder.Build();

            // Enable Swagger in development or always
            app.UseSwagger();
            app.UseSwaggerUI();

            // Apply CORS policy
            app.UseCors("corspolicy");

            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseAuthorization();
            app.MapControllers();
            app.Run();
        }
    }
}
