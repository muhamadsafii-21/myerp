using MyERP.Api.DTOs.User;

namespace MyERP.Api.Services.Interfaces
{
    public interface INotificationService
    {
        Task<List<NotificationDto>> GetNotificationsAsync();
        Task<NotificationCountDto> GetCountAsync();
    }
}