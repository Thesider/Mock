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
            // Ensure EF does not try to insert related Doctor/Patient entities
            if (appointment.Doctor != null)
            {
                _context.Entry(appointment.Doctor).State = EntityState.Unchanged;
            }

            if (appointment.Patient != null)
            {
                _context.Entry(appointment.Patient).State = EntityState.Unchanged;
            }

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();
            return appointment;
        }

        public async Task<AppointmentEntity?> GetAppointmentByIdAsync(int id)
        {
            return await _context.Appointments
                .Include(a => a.Doctor)
                .Include(a => a.Patient)
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<IEnumerable<AppointmentEntity>> GetAllAppointmentsAsync()
        {
            return await _context.Appointments
                .Include(a => a.Doctor)
                .Include(a => a.Patient)
                .ToListAsync();
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
