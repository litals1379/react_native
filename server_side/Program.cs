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
using System.Text.Encodings.Web;
using System.Text.Unicode;


namespace Server_Side
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

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
            builder.Services.AddSingleton<ReadingPromptService>();
            builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("CloudinarySettings"));
            builder.Services.AddHttpClient();
            builder.Logging.AddConsole();
            var app = builder.Build();

            if (true)
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseCors("corspolicy");
            app.UseRouting();
            app.UseAuthorization();
            app.MapControllers();
            app.Run();
        }
    }
}
