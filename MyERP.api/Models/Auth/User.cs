using System.ComponentModel.DataAnnotations;
using MyERP.Api.Models.Base;

namespace MyERP.Api.Models.Auth
{
    public class User : BaseEntity
    {
        [Required]
        [MaxLength(50)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? Role { get; set; } = "Staff";

        [MaxLength(500)]
        public string? AvatarUrl { get; set; }

        public DateTime? LastLoginAt { get; set; }
    }
}