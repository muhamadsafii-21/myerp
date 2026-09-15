using MyERP.Api.DTOs.Transaction;

namespace MyERP.Api.Services.Interfaces
{
    public interface ISalesOrderService
    {
        Task<List<SalesOrderDto>> GetAllAsync();
        Task<SalesOrderDto?> GetByIdAsync(int id);
        Task<SalesOrderDto> CreateAsync(CreateSalesOrderDto dto);
        Task<SalesOrderDto> CompleteAsync(int id);
        Task<bool> DeleteAsync(int id);
    }
}