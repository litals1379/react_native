using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using MongoDB.Driver;
using Server_Side.DAL;
using Server_Side.BL;
using System.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.OpenApi.Models;
using Server_Side.Services;
using Server_Side.Models;
using System.Text.Encodings.Web;
using System.Text.Unicode;
using System;
using System.Net.Http; // Required for HttpClient
using Microsoft.Extensions.Logging; // Required for ILogger in GoogleAIService

namespace Server_Side
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            
            builder.Services.AddSingleton(sp =>
            {
                var googleCloudConfig = builder.Configuration.GetSection("GoogleCloud");
                return new GoogleCloudSettings
                {
                    ProjectId = googleCloudConfig["ProjectId"] ?? throw new ArgumentNullException("GoogleCloud:ProjectId not configured."),
                    Region = googleCloudConfig["Region"] ?? throw new ArgumentNullException("GoogleCloud:Region" +
                    " not configured."),
                    ServiceAccountKeyJson = googleCloudConfig["ServiceAccountKeyJson"] ?? throw new ArgumentNullException("GoogleCloud:ServiceAccountKeyJson not configured.")
                };
            });

            builder.Services.AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.Encoder = JavaScriptEncoder.Create(UnicodeRanges.All);
                });
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddCors(p =>
                p.AddPolicy("corspolicy", build =>
                    build.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));

            // רישום MongoDB Client
            builder.Services.AddSingleton<IMongoClient>(sp =>
                new MongoClient(builder.Configuration.GetConnectionString("MongoDB")));

            // רישום SqlConnection כ-Scoped (נפתח חדש לכל בקשה)
            builder.Services.AddScoped<DBservices>(provider =>
                new DBservices(builder.Configuration.GetConnectionString("SqlServer"))
            );


            builder.Services.AddScoped<UserDBservices>();
            builder.Services.AddScoped<StoryDBservices>();
            builder.Services.AddScoped<ReadingSessionReportDBservices>();
            builder.Services.AddSingleton<ReadingPromptService>();
            builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("CloudinarySettings"));
            builder.Services.AddSingleton<CloudinaryService>();
            //builder.Services.AddHttpClient();

            // --- Register GoogleAIService with HttpClient ---
            // This registers GoogleAIService and automatically configures HttpClient for it.
            // The GoogleAIService will receive GoogleCloudSettings via its constructor.
            builder.Services.AddHttpClient<GoogleAIService>();
            builder.Logging.AddConsole();
            builder.Logging.AddConsole();
            var app = builder.Build();

            if (true)
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseCors("corspolicy");
            app.UseRouting();
            app.UseHttpsRedirection(); // added to check
            app.UseAuthorization();
            app.MapControllers();
            app.Run();
        }
    }
}
