using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BriERPApi.Models
{
    public class Producto
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Nombre { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Descripcion { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Precio { get; set; }

        [Required]
        public int Stock { get; set; }

        [Required]
        [StringLength(50)]
        public string Categoria { get; set; } = "General";

        // Esta línea es la única que necesitas. Si ya la tenías, no cambies nada más.
        public string? ImagenUrl { get; set; } = "https://via.placeholder.com/150";

        public DateTime FechaCreacion { get; set; } = DateTime.Now;
    }
}