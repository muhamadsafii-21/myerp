using System.ComponentModel.DataAnnotations;
using MyERP.Api.Models.Base;
using MyERP.Api.Models.Master;

namespace MyERP.Api.Models.Transaction
{
    public class PurchaseOrder : BaseEntity
    {
        [Required]
        [MaxLength(50)]
        public string PoNumber { get; set; } = string.Empty;

        public int SupplierId { get; set; }
        public Supplier Supplier { get; set; } = null!;

        public DateTime OrderDate { get; set; } = DateTime.UtcNow;

        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = "Draft";

        public decimal TotalAmount { get; set; }

        public List<PurchaseOrderItem> Items { get; set; } = new();
    }
}