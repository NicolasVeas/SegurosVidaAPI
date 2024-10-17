using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SegurosVidaAPI.Data;
using SegurosVidaAPI.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SegurosVidaAPI.Controllers
{
    [Authorize] // Protegemos todas las rutas con JWT
    [Route("api/[controller]")]
    [ApiController]
    public class CuadrosTecnicosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CuadrosTecnicosController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/CuadrosTecnicos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CuadroTecnico>>> GetCuadrosTecnicos()
        {
            return await _context.CuadrosTecnicos.ToListAsync();
        }

        // GET: api/CuadrosTecnicos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CuadroTecnico>> GetCuadroTecnico(int id)
        {
            var cuadroTecnico = await _context.CuadrosTecnicos.FindAsync(id);

            if (cuadroTecnico == null)
            {
                return NotFound();
            }

            return cuadroTecnico;
        }

        // POST: api/CuadrosTecnicos
        [HttpPost]
        public async Task<ActionResult<CuadroTecnico>> PostCuadroTecnico(CuadroTecnico cuadroTecnico)
        {
            _context.CuadrosTecnicos.Add(cuadroTecnico);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCuadroTecnico), new { id = cuadroTecnico.Id }, cuadroTecnico);
        }

        // PUT: api/CuadrosTecnicos/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCuadroTecnico(int id, CuadroTecnico cuadroTecnico)
        {
            if (id != cuadroTecnico.Id)
            {
                return BadRequest();
            }

            _context.Entry(cuadroTecnico).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CuadroTecnicoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/CuadrosTecnicos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCuadroTecnico(int id)
        {
            var cuadroTecnico = await _context.CuadrosTecnicos.FindAsync(id);
            if (cuadroTecnico == null)
            {
                return NotFound();
            }

            _context.CuadrosTecnicos.Remove(cuadroTecnico);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CuadroTecnicoExists(int id)
        {
            return _context.CuadrosTecnicos.Any(e => e.Id == id);
        }
    }
}
