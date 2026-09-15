using System.ComponentModel.DataAnnotations;
using MyERP.Api.Models.Base;

namespace MyERP.Api.Models.Inventory
{
    public class Warehouse : BaseEntity
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(200)]
        public string? Location { get; set; }

        public List<ProductStock> ProductStocks { get; set; } = new();
        public List<StockMovement> StockMovements { get; set; } = new();
    }
}