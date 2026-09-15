using Microsoft.EntityFrameworkCore;
using MyERP.Api.Data;
using MyERP.Api.DTOs.Reports;
using MyERP.Api.Services.Interfaces;

namespace MyERP.Api.Services
{
    public class ReportService : IReportService
    {
        private readonly AppDbContext _context;

        public ReportService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PurchaseReportResponseDto> GetPurchaseReportAsync(DateTime? startDate, DateTime? endDate, int? supplierId)
        {
            var start = startDate ?? DateTime.UtcNow.Date.AddDays(-30);
            var end = endDate ?? DateTime.UtcNow.Date;

            var query = _context.PurchaseOrders
                .Include(po => po.Supplier)
                .Where(po => po.IsActive && po.Status == "Received")
                .Where(po => po.OrderDate >= start && po.OrderDate <= end.AddDays(1));

            if (supplierId.HasValue)
            {
                query = query.Where(po => po.SupplierId == supplierId.Value);
            }

            var orders = await query
                .OrderByDescending(po => po.OrderDate)
                .ToListAsync();

            var items = orders.Select(po => new PurchaseReportDto
            {
                Id = po.Id,
                PoNumber = po.PoNumber,
                SupplierName = po.Supplier?.Name,
                OrderDate = po.OrderDate,
                Status = po.Status,
                TotalAmount = po.TotalAmount
            }).ToList();

            return new PurchaseReportResponseDto
            {
                StartDate = start,
                EndDate = end,
                TotalAmount = items.Sum(i => i.TotalAmount),
                TotalTransactions = items.Count,
                Items = items
            };
        }

        public async Task<SalesReportResponseDto> GetSalesReportAsync(DateTime? startDate, DateTime? endDate, int? customerId)
        {
            var start = startDate ?? DateTime.UtcNow.Date.AddDays(-30);
            var end = endDate ?? DateTime.UtcNow.Date;

            var query = _context.SalesOrders
                .Include(so => so.Customer)
                .Where(so => so.IsActive && so.Status == "Completed")
                .Where(so => so.OrderDate >= start && so.OrderDate <= end.AddDays(1));

            if (customerId.HasValue)
            {
                query = query.Where(so => so.CustomerId == customerId.Value);
            }

            var orders = await query
                .OrderByDescending(so => so.OrderDate)
                .ToListAsync();

            var items = orders.Select(so => new SalesReportDto
            {
                Id = so.Id,
                InvoiceNumber = so.InvoiceNumber,
                CustomerName = so.Customer?.Name,
                OrderDate = so.OrderDate,
                Status = so.Status,
                TotalAmount = so.TotalAmount
            }).ToList();

            return new SalesReportResponseDto
            {
                StartDate = start,
                EndDate = end,
                TotalAmount = items.Sum(i => i.TotalAmount),
                TotalTransactions = items.Count,
                Items = items
            };
        }

        public async Task<StockReportResponseDto> GetStockReportAsync(bool lowStockOnly)
        {
            var query = _context.Products
                .Where(p => p.IsActive);

            if (lowStockOnly)
            {
                query = query.Where(p => p.Stock <= p.StockMinimum);
            }

            var products = await query
                .OrderBy(p => p.Name)
                .ToListAsync();

            var items = products.Select(p => new StockReportDto
            {
                Id = p.Id,
                SKU = p.SKU,
                Name = p.Name,
                Unit = p.Unit,
                Stock = p.Stock,
                StockMinimum = p.StockMinimum,
                Cost = p.Cost,
                Price = p.Price,
                StockValue = p.Stock * p.Cost
            }).ToList();

            return new StockReportResponseDto
            {
                TotalStockValue = items.Sum(i => i.StockValue),
                TotalProducts = items.Count,
                Items = items
            };
        }
    }
}