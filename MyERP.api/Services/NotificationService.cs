using Microsoft.EntityFrameworkCore;
using MyERP.Api.Data;
using MyERP.Api.DTOs.User;
using MyERP.Api.Services.Interfaces;

namespace MyERP.Api.Services
{
    public class NotificationService : INotificationService
    {
        private readonly AppDbContext _context;

        public NotificationService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<NotificationDto>> GetNotificationsAsync()
        {
            var notifications = new List<NotificationDto>();

            var lowStockProducts = await _context.Products
                .Where(p => p.IsActive && p.Stock <= p.StockMinimum)
                .OrderBy(p => p.Stock)
                .Take(5)
                .ToListAsync();

            foreach (var product in lowStockProducts)
            {
                notifications.Add(new NotificationDto
                {
                    Id = $"stock-{product.Id}",
                    Type = "warning",
                    Title = "Stok Menipis",
                    Message = $"{product.Name} tersisa {product.Stock} (min: {product.StockMinimum})",
                    CreatedAt = product.UpdatedAt,
                    IsRead = false
                });
            }

            var recentPOs = await _context.PurchaseOrders
                .Include(po => po.Supplier)
                .Where(po => po.IsActive && po.Status == "Received")
                .OrderByDescending(po => po.UpdatedAt)
                .Take(3)
                .ToListAsync();

            foreach (var po in recentPOs)
            {
                notifications.Add(new NotificationDto
                {
                    Id = $"po-{po.Id}",
                    Type = "info",
                    Title = "PO Diterima",
                    Message = $"{po.PoNumber} dari {po.Supplier?.Name ?? "-"}",
                    CreatedAt = po.UpdatedAt,
                    IsRead = false
                });
            }

            var recentSOs = await _context.SalesOrders
                .Include(so => so.Customer)
                .Where(so => so.IsActive && so.Status == "Completed")
                .OrderByDescending(so => so.UpdatedAt)
                .Take(3)
                .ToListAsync();

            foreach (var so in recentSOs)
            {
                notifications.Add(new NotificationDto
                {
                    Id = $"so-{so.Id}",
                    Type = "success",
                    Title = "Penjualan Selesai",
                    Message = $"{so.InvoiceNumber} ke {so.Customer?.Name ?? "-"}",
                    CreatedAt = so.UpdatedAt,
                    IsRead = false
                });
            }

            return notifications
                .OrderByDescending(n => n.CreatedAt)
                .Take(10)
                .ToList();
        }

        public async Task<NotificationCountDto> GetCountAsync()
        {
            var lowStockCount = await _context.Products
                .CountAsync(p => p.IsActive && p.Stock <= p.StockMinimum);

            var recentPOCount = await _context.PurchaseOrders
                .CountAsync(po => po.IsActive && po.Status == "Received"
                    && po.UpdatedAt >= DateTime.UtcNow.AddDays(-7));

            var recentSOCount = await _context.SalesOrders
                .CountAsync(so => so.IsActive && so.Status == "Completed"
                    && so.UpdatedAt >= DateTime.UtcNow.AddDays(-7));

            return new NotificationCountDto
            {
                UnreadCount = lowStockCount + recentPOCount + recentSOCount
            };
        }
    }
}