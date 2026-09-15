using MyERP.Api.Models.Base;
using MyERP.Api.Models.Master;

namespace MyERP.Api.Models.Inventory
{
    public class ProductStock : BaseEntity
    {
        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;

        public int WarehouseId { get; set; }
        public Warehouse Warehouse { get; set; } = null!;

        public int Quantity { get; set; }
    }
}