using System.ComponentModel.DataAnnotations;
using MyERP.Api.Models.Base;

namespace MyERP.Api.Models.Master
{
    public class Customer : BaseEntity
    {
        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? Phone { get; set; }

        [MaxLength(100)]
        public string? Email { get; set; }

        [MaxLength(500)]
        public string? Address { get; set; }

        [MaxLength(100)]
        public string? City { get; set; }
    }
}