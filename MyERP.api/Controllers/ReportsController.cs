using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyERP.Api.Services.Interfaces;

namespace MyERP.Api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly IReportService _reportService;

        public ReportsController(IReportService reportService)
        {
            _reportService = reportService;
        }

        [HttpGet("purchases")]
        public async Task<IActionResult> GetPurchaseReport(
            [FromQuery] DateTime? startDate,
            [FromQuery] DateTime? endDate,
            [FromQuery] int? supplierId)
        {
            var report = await _reportService.GetPurchaseReportAsync(startDate, endDate, supplierId);
            return Ok(report);
        }

        [HttpGet("sales")]
        public async Task<IActionResult> GetSalesReport(
            [FromQuery] DateTime? startDate,
            [FromQuery] DateTime? endDate,
            [FromQuery] int? customerId)
        {
            var report = await _reportService.GetSalesReportAsync(startDate, endDate, customerId);
            return Ok(report);
        }

        [HttpGet("stock")]
        public async Task<IActionResult> GetStockReport([FromQuery] bool lowStockOnly = false)
        {
            var report = await _reportService.GetStockReportAsync(lowStockOnly);
            return Ok(report);
        }
    }
}