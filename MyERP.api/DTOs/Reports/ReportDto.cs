namespace MyERP.Api.DTOs.Reports
{
    public class PurchaseReportDto
    {
        public int Id { get; set; }
        public string PoNumber { get; set; } = string.Empty;
        public string? SupplierName { get; set; }
        public DateTime OrderDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
    }

    public class SalesReportDto
    {
        public int Id { get; set; }
        public string InvoiceNumber { get; set; } = string.Empty;
        public string? CustomerName { get; set; }
        public DateTime OrderDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
    }

    public class StockReportDto
    {
        public int Id { get; set; }
        public string SKU { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Unit { get; set; }
        public int Stock { get; set; }
        public int StockMinimum { get; set; }
        public decimal Cost { get; set; }
        public decimal Price { get; set; }
        public decimal StockValue { get; set; }
    }

    public class PurchaseReportResponseDto
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal TotalAmount { get; set; }
        public int TotalTransactions { get; set; }
        public List<PurchaseReportDto> Items { get; set; } = new();
    }

    public class SalesReportResponseDto
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal TotalAmount { get; set; }
        public int TotalTransactions { get; set; }
        public List<SalesReportDto> Items { get; set; } = new();
    }

    public class StockReportResponseDto
    {
        public decimal TotalStockValue { get; set; }
        public int TotalProducts { get; set; }
        public List<StockReportDto> Items { get; set; } = new();
    }
}