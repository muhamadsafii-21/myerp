using Microsoft.EntityFrameworkCore;
using MyERP.Api.Data;
using MyERP.Api.DTOs.User;
using MyERP.Api.Helpers;
using MyERP.Api.Services.Interfaces;

namespace MyERP.Api.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;

        public UserService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<UserProfileDto?> GetProfileAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            return user == null ? null : MapToDto(user);
        }

        public async Task<UserProfileDto> UpdateProfileAsync(int userId, UpdateProfileDto dto)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                throw new KeyNotFoundException("User tidak ditemukan.");
            }

            user.FullName = dto.FullName;
            user.Email = dto.Email;
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return MapToDto(user);
        }

        public async Task<bool> ChangePasswordAsync(int userId, ChangePasswordDto dto)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                throw new KeyNotFoundException("User tidak ditemukan.");
            }

            if (!PasswordHasher.VerifyPassword(dto.CurrentPassword, user.PasswordHash))
            {
                throw new InvalidOperationException("Password lama tidak sesuai.");
            }

            user.PasswordHash = PasswordHasher.HashPassword(dto.NewPassword);
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<UserProfileDto> UploadAvatarAsync(int userId, IFormFile file)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                throw new KeyNotFoundException("User tidak ditemukan.");
            }

            if (file == null || file.Length == 0)
            {
                throw new InvalidOperationException("File tidak valid.");
            }

            if (file.Length > 2 * 1024 * 1024)
            {
                throw new InvalidOperationException("Ukuran file maksimal 2 MB.");
            }

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png" };
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(extension))
            {
                throw new InvalidOperationException("Format file harus JPG atau PNG.");
            }

            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            var bytes = memoryStream.ToArray();

            var base64 = Convert.ToBase64String(bytes);
            var mimeType = extension == ".png" ? "image/png" : "image/jpeg";
            var dataUri = $"data:{mimeType};base64,{base64}";

            user.AvatarData = dataUri;
            user.AvatarUrl = null;
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return MapToDto(user);
        }

        public async Task<bool> DeleteAvatarAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return false;

            user.AvatarData = null;
            user.AvatarUrl = null;
            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return true;
        }

        private static UserProfileDto MapToDto(Models.Auth.User user)
        {
            return new UserProfileDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                FullName = user.FullName,
                Role = user.Role,
                AvatarUrl = user.AvatarUrl,
                AvatarData = user.AvatarData,
                LastLoginAt = user.LastLoginAt
            };
        }
    }
}