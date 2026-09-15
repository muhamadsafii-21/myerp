using Microsoft.EntityFrameworkCore;
using MyERP.Api.Data;
using MyERP.Api.DTOs.Auth;
using MyERP.Api.Helpers;
using MyERP.Api.Models.Auth;
using MyERP.Api.Services.Interfaces;

namespace MyERP.Api.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly JwtHelper _jwtHelper;

        public AuthService(AppDbContext context, JwtHelper jwtHelper)
        {
            _context = context;
            _jwtHelper = jwtHelper;
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == dto.Username);

            if (user == null)
            {
                throw new UnauthorizedAccessException("Username atau password salah.");
            }

            if (!PasswordHasher.VerifyPassword(dto.Password, user.PasswordHash))
            {
                throw new UnauthorizedAccessException("Username atau password salah.");
            }

            var token = _jwtHelper.GenerateToken(user);
            return new AuthResponseDto
            {
                Token = token,
                Username = user.Username,
                FullName = user.FullName,
                Email = user.Email,           // ← Harus ada
                Role = user.Role ?? "Staff",
                AvatarUrl = user.AvatarUrl,   // ← Harus ada
                ExpiresAt = DateTime.UtcNow.AddMinutes(60)
            };
        }
    }
}