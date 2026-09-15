namespace MyERP.Api.DTOs.Auth
{
    public class AuthResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;        // ← TAMBAH
        public string Role { get; set; } = string.Empty;
        public string? AvatarUrl { get; set; }                    // ← TAMBAH
        public DateTime ExpiresAt { get; set; }
    }
}