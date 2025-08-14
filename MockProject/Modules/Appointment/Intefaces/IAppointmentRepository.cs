namespace MockProject.Modules.Appointment
{
    public interface IAppointmentRepository
    {
        Task<AppointmentEntity> CreateAppointmentAsync(AppointmentEntity appointment);
        Task<AppointmentEntity?> GetAppointmentByIdAsync(int id);
        Task<IEnumerable<AppointmentEntity>> GetAllAppointmentsAsync();
        Task UpdateAppointmentAsync(AppointmentEntity appointment);
        Task DeleteAppointmentAsync(int id);
    }
}
