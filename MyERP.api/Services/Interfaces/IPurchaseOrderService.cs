using MyERP.Api.DTOs.Transaction;

namespace MyERP.Api.Services.Interfaces
{
    public interface IPurchaseOrderService
    {
        Task<List<PurchaseOrderDto>> GetAllAsync();
        Task<PurchaseOrderDto?> GetByIdAsync(int id);
        Task<PurchaseOrderDto> CreateAsync(CreatePurchaseOrderDto dto);
        Task<PurchaseOrderDto> ReceiveAsync(int id);
        Task<bool> DeleteAsync(int id);
    }
}