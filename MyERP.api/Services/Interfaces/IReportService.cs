using MyERP.Api.DTOs.Reports;

namespace MyERP.Api.Services.Interfaces
{
    public interface IReportService
    {
        Task<PurchaseReportResponseDto> GetPurchaseReportAsync(DateTime? startDate, DateTime? endDate, int? supplierId);
        Task<SalesReportResponseDto> GetSalesReportAsync(DateTime? startDate, DateTime? endDate, int? customerId);
        Task<StockReportResponseDto> GetStockReportAsync(bool lowStockOnly);
    }
}