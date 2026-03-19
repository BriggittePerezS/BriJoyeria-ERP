using Microsoft.EntityFrameworkCore;
using BriERPApi.Models;

namespace BriERPApi.Data
{
    public class BriDbContext : DbContext
    {
        public BriDbContext(DbContextOptions<BriDbContext> options) : base(options) { }

        // Esta es la tabla de productos en la base de datos
        public DbSet<Producto> Productos { get; set; }
    }
}