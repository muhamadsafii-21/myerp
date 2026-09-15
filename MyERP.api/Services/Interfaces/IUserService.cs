using MyERP.Api.DTOs.User;

namespace MyERP.Api.Services.Interfaces
{
    public interface IUserService
    {
        Task<UserProfileDto?> GetProfileAsync(int userId);
        Task<UserProfileDto> UpdateProfileAsync(int userId, UpdateProfileDto dto);
        Task<bool> ChangePasswordAsync(int userId, ChangePasswordDto dto);
        Task<UserProfileDto> UploadAvatarAsync(int userId, IFormFile file);
        Task<bool> DeleteAvatarAsync(int userId);
    }
}