namespace MyERP.Api.DTOs.Dashboard
{
    public class DashboardDto
    {
        public DashboardStatsDto Stats { get; set; } = new();
        public List<SalesChartDto> SalesChart { get; set; } = new();
        public List<LowStockDto> LowStockProducts { get; set; } = new();
        public List<RecentActivityDto> RecentActivity { get; set; } = new();
    }

    public class DashboardStatsDto
    {
        public int TotalProducts { get; set; }
        public int TotalCustomers { get; set; }
        public decimal PurchasesThisMonth { get; set; }
        public decimal SalesThisMonth { get; set; }
    }

    public class SalesChartDto
    {
        public string Date { get; set; } = string.Empty;
        public decimal Sales { get; set; }
        public decimal Purchases { get; set; }
    }

    public class LowStockDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? SKU { get; set; }
        public int Stock { get; set; }
        public int StockMinimum { get; set; }
    }

    public class RecentActivityDto
    {
        public string Type { get; set; } = string.Empty;
        public string Reference { get; set; } = string.Empty;
        public string? PartyName { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
    }
}