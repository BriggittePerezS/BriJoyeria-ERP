using Microsoft.EntityFrameworkCore;
using BriERPApi.Data;

var builder = WebApplication.CreateBuilder(args);

// 1. Base de datos
builder.Services.AddDbContext<BriDbContext>(options =>
    options.UseSqlite("Data Source=joyeria.db"));

// 2. CORS (Puertas abiertas para tu joyería)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

builder.Services.AddControllers();

var app = builder.Build();

// 3. Configuración de Middleware
app.UseCors("AllowAll");

// RUTA DE PRUEBA: Si entras a la URL principal, verás este mensaje
app.MapGet("/", () => "¡El Backend de Bri Joyería está vivo!");

app.UseAuthorization();
app.MapControllers();

// 4. EL CAMBIO VITAL: Usar el puerto que Render asigne o el 8080 por defecto
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
app.Run($"http://0.0.0.0:{port}");