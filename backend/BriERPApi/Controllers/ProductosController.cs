using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BriERPApi.Data;
using BriERPApi.Models;

namespace BriERPApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // Ahora esto se traducirá automáticamente a /api/productos
    public class ProductosController : ControllerBase
    {
        private readonly BriDbContext _context;

        public ProductosController(BriDbContext context)
        {
            _context = context;
        }

        // 1. OBTENER TODOS LOS PRODUCTOS
        // URL: GET /api/productos
        [HttpGet]
        public async Task<IActionResult> GetProductos()
        {
            var productos = await _context.Productos.ToListAsync();
            return Ok(productos);
        }

        // 2. OBTENER REPORTE DE VALORES
        // URL: GET /api/productos/reporte-valor
        [HttpGet("reporte-valor")]
        public async Task<IActionResult> GetReporte()
        {
            var productos = await _context.Productos.ToListAsync();
            var reporte = new
            {
                ValorInventarioTotal = productos.Sum(p => p.Precio * p.Stock),
                PiezasTotales = productos.Sum(p => p.Stock)
            };
            return Ok(reporte);
        }

        // 3. AGREGAR NUEVO PRODUCTO
        // URL: POST /api/productos
        [HttpPost]
        public async Task<IActionResult> AgregarProducto([FromBody] Producto nuevo)
        {
            _context.Productos.Add(nuevo);
            await _context.SaveChangesAsync();
            return Ok(nuevo);
        }

        // 4. EDITAR PRODUCTO EXISTENTE
        // URL: PUT /api/productos/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> EditarProducto(int id, [FromBody] Producto productoEditado)
        {
            if (id != productoEditado.Id)
            {
                return BadRequest("El ID no coincide");
            }

            var productoOriginal = await _context.Productos.FindAsync(id);
            if (productoOriginal == null)
            {
                return NotFound();
            }

            productoOriginal.Nombre = productoEditado.Nombre;
            productoOriginal.Categoria = productoEditado.Categoria;
            productoOriginal.Precio = productoEditado.Precio;
            productoOriginal.Stock = productoEditado.Stock;
            productoOriginal.ImagenUrl = productoEditado.ImagenUrl;
            productoOriginal.Descripcion = productoEditado.Descripcion;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(productoOriginal);
            }
            catch (DbUpdateConcurrencyException)
            {
                return StatusCode(500, "Error al guardar en la base de datos");
            }
        }

        // 5. ELIMINAR PRODUCTO
        // URL: DELETE /api/productos/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            var producto = await _context.Productos.FindAsync(id);
            if (producto == null) return NotFound();

            _context.Productos.Remove(producto);
            await _context.SaveChangesAsync();
            return Ok(new { mensaje = "Eliminado" });
        }
    }
}