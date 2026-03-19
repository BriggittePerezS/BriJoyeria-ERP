using Microsoft.EntityFrameworkCore;
using BriERPApi.Data;

var builder = WebApplication.CreateBuilder(args);

// 1. Configurar la Conexión a la Base de Datos (SQLite - ¡La bóveda portátil!)
builder.Services.AddDbContext<BriDbContext>(options =>
    options.UseSqlite("Data Source=joyeria.db"));

// 2. Configurar CORS (Permite que tu React se conecte al Backend)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 3. Activar el uso de CORS (Importante ponerlo antes de MapControllers)
app.UseCors("AllowAll");

// Esto permite que Swagger funcione en Render para que puedas probar la API
app.UseSwagger();
app.UseSwaggerUI();

app.UseAuthorization();
app.MapControllers();

// 4. Configuración para Render (Uso de puerto dinámico)
var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
app.Run($"http://0.0.0.0:{port}");