using MockProject.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace MockProject.Modules.Doctor
{
    public class DoctorRepository : IDoctorRepository
    {
        private readonly MockDbContext _context;

        public DoctorRepository(MockDbContext context)
        {
            _context = context;
        }

        public async Task AddDoctorAsync(DoctorEntity doctor)
        {
            _context.Doctors.Add(doctor);
            await _context.SaveChangesAsync();
        }

        public async Task<DoctorEntity> GetDoctorByIdAsync(int id)
        {
            var doctor = await _context.Doctors.FindAsync(id);
            if (doctor == null)
            {
                throw new InvalidOperationException($"Doctor with id {id} not found.");
            }
            return doctor;
        }

        public async Task<IEnumerable<DoctorEntity>> GetAllDoctorsAsync()
        {
            return await _context.Doctors.ToListAsync();
        }

        public async Task<IEnumerable<T>> GetDoctorPropertyAsync<T>(Expression<Func<DoctorEntity, T>> selector)
        {
            return await _context.Doctors.Select(selector).ToListAsync();
        }

        public async Task UpdateDoctorAsync(DoctorEntity doctor)
        {
            _context.Doctors.Update(doctor);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteDoctorAsync(int id)
        {
            var doctor = await _context.Doctors.FindAsync(id);
            if (doctor != null)
            {
                _context.Doctors.Remove(doctor);
                await _context.SaveChangesAsync();
            }
        }
    }
}