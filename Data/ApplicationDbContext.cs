using Microsoft.EntityFrameworkCore;
using SegurosVidaAPI.Models;

namespace SegurosVidaAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<CuadroTecnico> CuadrosTecnicos { get; set; }
    }
}
