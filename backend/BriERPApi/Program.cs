using Microsoft.EntityFrameworkCore;
using BriERPApi.Data;

var builder = WebApplication.CreateBuilder(args);

// 1. Configurar la Conexión a la Base de Datos (SQLite)
builder.Services.AddDbContext<BriDbContext>(options =>
    options.UseSqlite("Data Source=joyeria.db"));

// 2. Configurar CORS (Permisos de conexión)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.WithOrigins("https://brijoyeria-erp-sw9h.onrender.com") // <--- TU URL DE STATIC SITE
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// --- ⚠️ ESTE ES EL CAMBIO CLAVE: CORS VA PRIMERO ---
app.UseCors("AllowAll");
// --------------------------------------------------

// Configuración de Swagger
app.UseSwagger();
app.UseSwaggerUI();

app.UseAuthorization();
app.MapControllers();

// 4. Configuración para Render (Puerto dinámico)
var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
app.Run($"http://0.0.0.0:{port}");