namespace MyERP.Api.DTOs.Master
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string SKU { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Unit { get; set; }
        public int Stock { get; set; }
        public int StockMinimum { get; set; }
        public decimal Cost { get; set; }
        public decimal Price { get; set; }
        public int? CategoryId { get; set; }
        public int? SupplierId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public bool IsActive { get; set; }
    }

    public class CreateProductDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Unit { get; set; }
        public int Stock { get; set; }
        public int StockMinimum { get; set; }
        public decimal Cost { get; set; }
        public decimal Price { get; set; }
        public int? CategoryId { get; set; }
        public int? SupplierId { get; set; }
    }

    public class UpdateProductDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Unit { get; set; }
        public int Stock { get; set; }
        public int StockMinimum { get; set; }
        public decimal Cost { get; set; }
        public decimal Price { get; set; }
        public int? CategoryId { get; set; }
        public int? SupplierId { get; set; }
        public bool IsActive { get; set; }
    }
}