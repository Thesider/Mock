namespace MockProject.Modules.Appointment
{
    public interface IAppointmentService
    {
        Task<AppointmentEntity> CreateAppointmentAsync(AppointmentEntity appointment);
        Task<AppointmentEntity?> GetAppointmentByIdAsync(int id);
        Task<IEnumerable<AppointmentEntity>> GetAllAppointmentsAsync();
        Task UpdateAppointmentAsync(AppointmentEntity appointment);
        Task DeleteAppointmentAsync(int id);
    }
}
