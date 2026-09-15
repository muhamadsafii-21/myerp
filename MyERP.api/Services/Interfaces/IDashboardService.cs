using MyERP.Api.DTOs.Dashboard;

namespace MyERP.Api.Services.Interfaces
{
    public interface IDashboardService
    {
        Task<DashboardDto> GetDashboardDataAsync();
    }
}