using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SegurosVidaAPI.Models
{
    public class CuadroTecnico
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Nombre { get; set; }

        public string Descripcion { get; set; }

        [Column(TypeName = "decimal(18, 2)")] 
        public decimal MontoAsegurado { get; set; }

        [Column(TypeName = "decimal(18, 2)")] 
        public decimal Prima { get; set; }

        public DateTime FechaCreacion { get; set; }
    }
}
