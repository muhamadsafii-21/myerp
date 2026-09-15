using Microsoft.EntityFrameworkCore;
using MyERP.Api.Data;
using MyERP.Api.DTOs.Transaction;
using MyERP.Api.Models.Inventory;
using MyERP.Api.Models.Transaction;
using MyERP.Api.Services.Interfaces;

namespace MyERP.Api.Services
{
    public class PurchaseOrderService : IPurchaseOrderService
    {
        private readonly AppDbContext _context;

        public PurchaseOrderService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<PurchaseOrderDto>> GetAllAsync()
        {
            var orders = await _context.PurchaseOrders
                .Include(po => po.Supplier)
                .Include(po => po.Items)
                    .ThenInclude(i => i.Product)
                .Where(po => po.IsActive)
                .OrderByDescending(po => po.OrderDate)
                .ToListAsync();

            return orders.Select(MapToDto).ToList();
        }

        public async Task<PurchaseOrderDto?> GetByIdAsync(int id)
        {
            var order = await _context.PurchaseOrders
                .Include(po => po.Supplier)
                .Include(po => po.Items)
                    .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(po => po.Id == id && po.IsActive);

            return order == null ? null : MapToDto(order);
        }

        public async Task<PurchaseOrderDto> CreateAsync(CreatePurchaseOrderDto dto)
        {
            var supplier = await _context.Suppliers
                .FirstOrDefaultAsync(s => s.Id == dto.SupplierId && s.IsActive);

            if (supplier == null)
            {
                throw new InvalidOperationException("Supplier tidak ditemukan.");
            }

            var productIds = dto.Items.Select(i => i.ProductId).Distinct().ToList();
            var products = await _context.Products
                .Where(p => productIds.Contains(p.Id) && p.IsActive)
                .ToDictionaryAsync(p => p.Id);

            if (products.Count != productIds.Count)
            {
                throw new InvalidOperationException("Ada produk yang tidak valid atau sudah tidak aktif.");
            }

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var po = new PurchaseOrder
                {
                    PoNumber = await GeneratePoNumberAsync(),
                    SupplierId = dto.SupplierId,
                    OrderDate = DateTime.UtcNow,
                    Status = "Draft",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    TotalAmount = dto.Items.Sum(i => i.Quantity * i.UnitPrice),
                    Items = dto.Items.Select(i => new PurchaseOrderItem
                    {
                        ProductId = i.ProductId,
                        Quantity = i.Quantity,
                        UnitPrice = i.UnitPrice
                    }).ToList()
                };

                _context.PurchaseOrders.Add(po);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return await GetByIdAsync(po.Id) ?? throw new Exception("Gagal memuat PO.");
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<PurchaseOrderDto> ReceiveAsync(int id)
        {
            var po = await _context.PurchaseOrders
                .Include(po => po.Items)
                .FirstOrDefaultAsync(po => po.Id == id && po.IsActive);

            if (po == null)
            {
                throw new KeyNotFoundException("Purchase Order tidak ditemukan.");
            }

            if (po.Status == "Received")
            {
                throw new InvalidOperationException("PO sudah pernah diterima.");
            }

            var warehouse = await _context.Warehouses
                .FirstOrDefaultAsync(w => w.IsActive);

            if (warehouse == null)
            {
                throw new InvalidOperationException("Tidak ada warehouse aktif. Buat warehouse terlebih dahulu.");
            }

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                foreach (var item in po.Items)
                {
                    var stock = await _context.ProductStocks
                        .FirstOrDefaultAsync(ps => ps.ProductId == item.ProductId && ps.WarehouseId == warehouse.Id);

                    if (stock == null)
                    {
                        stock = new ProductStock
                        {
                            ProductId = item.ProductId,
                            WarehouseId = warehouse.Id,
                            Quantity = 0,
                            IsActive = true,
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        };
                        _context.ProductStocks.Add(stock);
                    }

                    stock.Quantity += item.Quantity;
                    stock.UpdatedAt = DateTime.UtcNow;

                    var product = await _context.Products.FindAsync(item.ProductId);
                    if (product != null)
                    {
                        product.Stock += item.Quantity;
                        product.UpdatedAt = DateTime.UtcNow;
                    }

                    _context.StockMovements.Add(new StockMovement
                    {
                        ProductId = item.ProductId,
                        WarehouseId = warehouse.Id,
                        Quantity = item.Quantity,
                        Type = "IN",
                        Reference = po.PoNumber,
                        Notes = $"Penerimaan PO {po.PoNumber}",
                        PerformedAt = DateTime.UtcNow
                    });
                }

                po.Status = "Received";
                po.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return await GetByIdAsync(po.Id) ?? throw new Exception("Gagal memuat PO.");
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var po = await _context.PurchaseOrders
                .FirstOrDefaultAsync(po => po.Id == id && po.IsActive);

            if (po == null) return false;

            if (po.Status == "Received")
            {
                throw new InvalidOperationException("PO yang sudah diterima tidak bisa dihapus.");
            }

            po.IsActive = false;
            po.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return true;
        }

        private async Task<string> GeneratePoNumberAsync()
        {
            var today = DateTime.UtcNow.ToString("yyyyMMdd");
            var prefix = $"PO/{today}/";

            var lastPo = await _context.PurchaseOrders
                .Where(po => po.PoNumber.StartsWith(prefix))
                .OrderByDescending(po => po.PoNumber)
                .FirstOrDefaultAsync();

            int sequence = 1;
            if (lastPo != null)
            {
                var lastSequence = lastPo.PoNumber.Substring(prefix.Length);
                if (int.TryParse(lastSequence, out int parsed))
                {
                    sequence = parsed + 1;
                }
            }

            return $"{prefix}{sequence:D3}";
        }

        private static PurchaseOrderDto MapToDto(PurchaseOrder po)
        {
            return new PurchaseOrderDto
            {
                Id = po.Id,
                PoNumber = po.PoNumber,
                SupplierId = po.SupplierId,
                SupplierName = po.Supplier?.Name,
                OrderDate = po.OrderDate,
                Status = po.Status,
                TotalAmount = po.TotalAmount,
                CreatedAt = po.CreatedAt,
                Items = po.Items.Select(i => new PurchaseOrderItemDto
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