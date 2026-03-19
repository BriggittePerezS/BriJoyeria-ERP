using Microsoft.EntityFrameworkCore;
using BriERPApi.Data;

var builder = WebApplication.CreateBuilder(args);

// 1. Configurar la Conexión a la Base de Datos (SQL Server)
builder.Services.AddDbContext<BriDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. Configurar CORS (Permite que tu React se conecte al Backend)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()
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

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();
app.MapControllers();

app.Run();