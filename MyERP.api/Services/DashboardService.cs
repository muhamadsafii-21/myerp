using Microsoft.EntityFrameworkCore;
using MyERP.Api.Data;
using MyERP.Api.DTOs.Dashboard;
using MyERP.Api.Services.Interfaces;

namespace MyERP.Api.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly AppDbContext _context;

        public DashboardService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<DashboardDto> GetDashboardDataAsync()
        {
            var now = DateTime.UtcNow;
            var startOfMonth = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
            var sevenDaysAgo = DateTime.SpecifyKind(now.Date.AddDays(-6), DateTimeKind.Utc);

            var stats = await GetStatsAsync(startOfMonth);
            var salesChart = await GetSalesChartAsync(sevenDaysAgo);
            var lowStock = await GetLowStockAsync();
            var recentActivity = await GetRecentActivityAsync();

            return new DashboardDto
            {
                Stats = stats,
                SalesChart = salesChart,
                LowStockProducts = lowStock,
                RecentActivity = recentActivity
            };
        }

        private async Task<DashboardStatsDto> GetStatsAsync(DateTime startOfMonth)
        {
            startOfMonth = DateTime.SpecifyKind(startOfMonth, DateTimeKind.Utc);

            var totalProducts = await _context.Products
                .CountAsync(p => p.IsActive);

            var totalCustomers = await _context.Customers
                .CountAsync(c => c.IsActive);

            var purchasesThisMonth = await _context.PurchaseOrders
                .Where(po => po.IsActive && po.Status == "Received" && po.OrderDate >= startOfMonth)
                .SumAsync(po => (decimal?)po.TotalAmount) ?? 0;

            var salesThisMonth = await _context.SalesOrders
                .Where(so => so.IsActive && so.Status == "Completed" && so.OrderDate >= startOfMonth)
                .SumAsync(so => (decimal?)so.TotalAmount) ?? 0;

            return new DashboardStatsDto
            {
                TotalProducts = totalProducts,
                TotalCustomers = totalCustomers,
                PurchasesThisMonth = purchasesThisMonth,
                SalesThisMonth = salesThisMonth
            };
        }

        private async Task<List<SalesChartDto>> GetSalesChartAsync(DateTime startDate)
        {
            startDate = DateTime.SpecifyKind(startDate, DateTimeKind.Utc);

            var purchases = await _context.PurchaseOrders
                .Where(po => po.IsActive && po.Status == "Received" && po.OrderDate >= startDate)
                .GroupBy(po => po.OrderDate.Date)
                .Select(g => new { Date = g.Key, Total = g.Sum(po => po.TotalAmount) })
                .ToListAsync();

            var sales = await _context.SalesOrders
                .Where(so => so.IsActive && so.Status == "Completed" && so.OrderDate >= startDate)
                .GroupBy(so => so.OrderDate.Date)
                .Select(g => new { Date = g.Key, Total = g.Sum(so => so.TotalAmount) })
                .ToListAsync();

            var result = new List<SalesChartDto>();
            for (int i = 0; i < 7; i++)
            {
                var date = startDate.AddDays(i);
                var purchaseTotal = purchases.FirstOrDefault(p => p.Date == date.Date)?.Total ?? 0;
                var salesTotal = sales.FirstOrDefault(s => s.Date == date.Date)?.Total ?? 0;

                result.Add(new SalesChartDto
                {
                    Date = date.ToString("dd MMM"),
                    Sales = salesTotal,
                    Purchases = purchaseTotal
                });
            }

            return result;
        }

        private async Task<List<LowStockDto>> GetLowStockAsync()
        {
            return await _context.Products
                .Where(p => p.IsActive && p.Stock <= p.StockMinimum)
                .OrderBy(p => p.Stock)
                .Take(5)
                .Select(p => new LowStockDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    SKU = p.SKU,
                    Stock = p.Stock,
                    StockMinimum = p.StockMinimum
                })
                .ToListAsync();
        }

        private async Task<List<RecentActivityDto>> GetRecentActivityAsync()
        {
            var recentPOs = await _context.PurchaseOrders
                .Include(po => po.Supplier)
                .Where(po => po.IsActive && po.Status == "Received")
                .OrderByDescending(po => po.OrderDate)
                .Take(5)
                .Select(po => new RecentActivityDto
                {
                    Type = "PO",
                    Reference = po.PoNumber,
                    PartyName = po.Supplier.Name,
                    Amount = po.TotalAmount,
                    Date = po.OrderDate
                })
                .ToListAsync();

            var recentSOs = await _context.SalesOrders
                .Include(so => so.Customer)
                .Where(so => so.IsActive && so.Status == "Completed")
                .OrderByDescending(so => so.OrderDate)
                .Take(5)
                .Select(so => new RecentActivityDto
                {
                    Type = "SO",
                    Reference = so.InvoiceNumber,
                    PartyName = so.Customer.Name,
                    Amount = so.TotalAmount,
                    Date = so.OrderDate
                })
                .ToListAsync();

            return recentPOs
                .Concat(recentSOs)
                .OrderByDescending(a => a.Date)
                .Take(5)
                .ToList();
        }
    }
}