using System.ComponentModel.DataAnnotations;
using MyERP.Api.Models.Base;
using MyERP.Api.Models.Master;

namespace MyERP.Api.Models.Transaction
{
    public class SalesOrder : BaseEntity
    {
        [Required]
        [MaxLength(50)]
        public string InvoiceNumber { get; set; } = string.Empty;

        public int CustomerId { get; set; }
        public Customer Customer { get; set; } = null!;

        public DateTime OrderDate { get; set; } = DateTime.UtcNow;

        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = "Draft";

        public decimal TotalAmount { get; set; }

        public List<SalesOrderItem> Items { get; set; } = new();   // ← Ini yang dicari
    }
}