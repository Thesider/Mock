using Microsoft.EntityFrameworkCore;
using MockProject.Data;

namespace MockProject.Modules.Appointment
{
    public class AppointmentRepository : IAppointmentRepository
    {
        public readonly MockDbContext _context;

        public AppointmentRepository(MockDbContext context)
        {
            _context = context;
        }

        public async Task<AppointmentEntity> CreateAppointmentAsync(AppointmentEntity appointment)
        {
            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();
            return appointment;
        }

        public async Task<AppointmentEntity?> GetAppointmentByIdAsync(int id)
        {
            return await _context.Appointments.FindAsync(id);
        }

        public async Task<IEnumerable<AppointmentEntity>> GetAllAppointmentsAsync()
        {
            return await _context.Appointments.ToListAsync();
        }

        public async Task UpdateAppointmentAsync(AppointmentEntity appointment)
        {
            _context.Appointments.Update(appointment);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAppointmentAsync(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment != null)
            {
                _context.Appointments.Remove(appointment);
                await _context.SaveChangesAsync();
            }
        }
    }
}