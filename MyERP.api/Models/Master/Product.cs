using System.ComponentModel.DataAnnotations;
using MyERP.Api.Models.Base;

namespace MyERP.Api.Models.Master
{
    public class Product : BaseEntity
    {
        [MaxLength(50)]
        public string SKU { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        [MaxLength(20)]
        public string? Unit { get; set; }

        public int Stock { get; set; }

        public int StockMinimum { get; set; }

        public decimal Cost { get; set; }

        public decimal Price { get; set; }

        public int? CategoryId { get; set; }

        public int? SupplierId { get; set; }

    }
}