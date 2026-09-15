using Microsoft.EntityFrameworkCore;
using MyERP.Api.Data;
using MyERP.Api.DTOs.Transaction;
using MyERP.Api.Models.Inventory;
using MyERP.Api.Models.Transaction;
using MyERP.Api.Services.Interfaces;

namespace MyERP.Api.Services
{
    public class SalesOrderService : ISalesOrderService
    {
        private readonly AppDbContext _context;

        public SalesOrderService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<SalesOrderDto>> GetAllAsync()
        {
            var orders = await _context.SalesOrders
                .Include(so => so.Customer)
                .Include(so => so.Items)
                    .ThenInclude(i => i.Product)
                .Where(so => so.IsActive)
                .OrderByDescending(so => so.OrderDate)
                .ToListAsync();

            return orders.Select(MapToDto).ToList();
        }

        public async Task<SalesOrderDto?> GetByIdAsync(int id)
        {
            var order = await _context.SalesOrders
                .Include(so => so.Customer)
                .Include(so => so.Items)
                    .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(so => so.Id == id && so.IsActive);

            return order == null ? null : MapToDto(order);
        }

        public async Task<SalesOrderDto> CreateAsync(CreateSalesOrderDto dto)
        {
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Id == dto.CustomerId && c.IsActive);

            if (customer == null)
            {
                throw new InvalidOperationException("Customer tidak ditemukan.");
            }

            var productIds = dto.Items.Select(i => i.ProductId).Distinct().ToList();
            var products = await _context.Products
                .Where(p => productIds.Contains(p.Id) && p.IsActive)
                .ToDictionaryAsync(p => p.Id);

            if (products.Count != productIds.Count)
            {
                throw new InvalidOperationException("Ada produk yang tidak valid atau sudah tidak aktif.");
            }

            foreach (var item in dto.Items)
            {
                if (products[item.ProductId].Stock < item.Quantity)
                {
                    throw new InvalidOperationException(
                        $"Stok produk '{products[item.ProductId].Name}' tidak cukup. Tersedia: {products[item.ProductId].Stock}, diminta: {item.Quantity}.");
                }
            }

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var so = new SalesOrder
                {
                    InvoiceNumber = await GenerateInvoiceNumberAsync(),
                    CustomerId = dto.CustomerId,
                    OrderDate = DateTime.UtcNow,
                    Status = "Draft",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    TotalAmount = dto.Items.Sum(i => i.Quantity * i.UnitPrice),
                    Items = dto.Items.Select(i => new SalesOrderItem
                    {
                        ProductId = i.ProductId,
                        Quantity = i.Quantity,
                        UnitPrice = i.UnitPrice
                    }).ToList()
                };

                _context.SalesOrders.Add(so);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return await GetByIdAsync(so.Id) ?? throw new Exception("Gagal memuat SO.");
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<SalesOrderDto> CompleteAsync(int id)
        {
            var so = await _context.SalesOrders
                .Include(so => so.Items)
                .FirstOrDefaultAsync(so => so.Id == id && so.IsActive);

            if (so == null)
            {
                throw new KeyNotFoundException("Sales Order tidak ditemukan.");
            }

            if (so.Status == "Completed")
            {
                throw new InvalidOperationException("SO sudah pernah diselesaikan.");
            }

            var warehouse = await _context.Warehouses
                .FirstOrDefaultAsync(w => w.IsActive);

            if (warehouse == null)
            {
                throw new InvalidOperationException("Tidak ada warehouse aktif.");
            }

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                foreach (var item in so.Items)
                {
                    var stock = await _context.ProductStocks
                        .FirstOrDefaultAsync(ps => ps.ProductId == item.ProductId && ps.WarehouseId == warehouse.Id);

                    if (stock == null || stock.Quantity < item.Quantity)
                    {
                        throw new InvalidOperationException(
                            $"Stok tidak cukup untuk produk ID {item.ProductId}.");
                    }

                    stock.Quantity -= item.Quantity;
                    stock.UpdatedAt = DateTime.UtcNow;

                    var product = await _context.Products.FindAsync(item.ProductId);
                    if (product != null)
                    {
                        product.Stock -= item.Quantity;
                        product.UpdatedAt = DateTime.UtcNow;
                    }

                    _context.StockMovements.Add(new StockMovement
                    {
                        ProductId = item.ProductId,
                        WarehouseId = warehouse.Id,
                        Quantity = item.Quantity,
                        Type = "OUT",
                        Reference = so.InvoiceNumber,
                        Notes = $"Penjualan {so.InvoiceNumber}",
                        PerformedAt = DateTime.UtcNow
                    });
                }

                so.Status = "Completed";
                so.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return await GetByIdAsync(so.Id) ?? throw new Exception("Gagal memuat SO.");
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var so = await _context.SalesOrders
                .FirstOrDefaultAsync(so => so.Id == id && so.IsActive);

            if (so == null) return false;

            if (so.Status == "Completed")
            {
                throw new InvalidOperationException("SO yang sudah selesai tidak bisa dihapus.");
            }

            so.IsActive = false;
            so.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return true;
        }

        private async Task<string> GenerateInvoiceNumberAsync()
        {
            var today = DateTime.UtcNow.ToString("yyyyMMdd");
            var prefix = $"INV/{today}/";

            var lastSo = await _context.SalesOrders
                .Where(so => so.InvoiceNumber.StartsWith(prefix))
                .OrderByDescending(so => so.InvoiceNumber)
                .FirstOrDefaultAsync();

            int sequence = 1;
            if (lastSo != null)
            {
                var lastSequence = lastSo.InvoiceNumber.Substring(prefix.Length);
                if (int.TryParse(lastSequence, out int parsed))
                {
                    sequence = parsed + 1;
                }
            }

            return $"{prefix}{sequence:D3}";
        }

        private static SalesOrderDto MapToDto(SalesOrder so)
        {
            return new SalesOrderDto
            {
                Id = so.Id,
                InvoiceNumber = so.InvoiceNumber,
                CustomerId = so.CustomerId,
                CustomerName = so.Customer?.Name,
                OrderDate = so.OrderDate,
                Status = so.Status,
                TotalAmount = so.TotalAmount,
                CreatedAt = so.CreatedAt,
                Items = so.Items.Select(i => new SalesOrderItemDto
                {
                    Id = i.Id,
                    ProductId = i.ProductId,
                    ProductName = i.Product?.Name,
                    ProductSku = i.Product?.SKU,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice
                }).ToList()
            };
        }
    }
}