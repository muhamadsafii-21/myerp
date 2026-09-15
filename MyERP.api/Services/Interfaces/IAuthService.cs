using MyERP.Api.DTOs.Auth;
using MyERP.Api.Models.Auth;

namespace MyERP.Api.Services.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto> LoginAsync(LoginDto dto);
    }
}