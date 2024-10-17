using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SegurosVidaAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        [HttpPost("login")]
        public IActionResult Login([FromBody] UserLogin userLogin)
        {
            // Validamos si el usuario es correcto (por simplicidad, sin base de datos)
            if (userLogin.Username == "admin" && userLogin.Password == "password")
            {
                var token = GenerateJwtToken(userLogin.Username);
                return Ok(new { token });
            }

            return Unauthorized();
        }

        // Método que genera el token JWT
        private string GenerateJwtToken(string username)
        {
            // Clave secreta más larga para cumplir con los requisitos de HS256
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("superSecretKey@345superSecretKey@345")); // Clave de al menos 256 bits

            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: "localhost",
                audience: "localhost",
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    public class UserLogin
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
