using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using MongoDB.Driver;
using Server_Side.DAL;
using Microsoft.Data.SqlClient;
using System.Data.SqlClient;


namespace Server_Side
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddCors(p =>
                p.AddPolicy("corspolicy", build =>
                    build.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));

            // רישום MongoDB Client
            builder.Services.AddSingleton<IMongoClient>(sp =>
                new MongoClient(builder.Configuration.GetConnectionString("MongoDB")));

            // רישום SqlConnection כ-Scoped (נפתח חדש לכל בקשה)
            builder.Services.AddScoped<SqlConnection>(sp =>
                new SqlConnection(builder.Configuration.GetConnectionString("SqlServer")));


            builder.Services.AddScoped<UserDBservices>();
            builder.Services.AddScoped<StoryDBservices>();

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseCors("corspolicy");
            app.UseAuthorization();
            app.MapControllers();
            app.Run();
        }
    }
}
