using System.ComponentModel.DataAnnotations;
using MyERP.Api.Models.Master;

namespace MyERP.Api.Models.Inventory
{
    public class StockMovement
    {
        public int Id { get; set; }

        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;

        public int WarehouseId { get; set; }
        public Warehouse Warehouse { get; set; } = null!;

        public int Quantity { get; set; }

        [Required]
        [MaxLength(10)]
        public string Type { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? Reference { get; set; }

        [MaxLength(500)]
        public string? Notes { get; set; }

        public DateTime PerformedAt { get; set; } = DateTime.UtcNow;
    }
}