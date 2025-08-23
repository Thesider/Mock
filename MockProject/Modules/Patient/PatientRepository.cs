using Microsoft.EntityFrameworkCore;
using MockProject.Data;

namespace MockProject.Modules.Patient
{
    public class PatientRepository : IPatientRepository
    {
        private readonly MockDbContext _context;


        public PatientRepository(MockDbContext context)
        {
            _context = context;
        }

        public Task AddPatientAsync(PatientEntity patient)
        {
            _context.Patients.Add(patient);
            return _context.SaveChangesAsync();
        }

        public async Task<PatientEntity?> GetPatientByIdAsync(int id)
        {
            var patient = await _context.Patients.FindAsync(id);
            // Return null when not found; caller should handle NotFound.
            return patient;
        }

        public async Task<PatientEntity?> GetPatientByNameAsync(string name)
        {
            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.Name == name);
            // Return null when not found; caller should handle NotFound.
            return patient;
        }

        public async Task<IEnumerable<PatientEntity>> GetAllPatientsAsync()
        {
            return await _context.Patients.ToListAsync();
        }

        public async Task UpdatePatientAsync(PatientEntity patient)
        {
            var tracked = await _context.Patients.FindAsync(patient.Id);
            if (tracked == null)
            {
                // Nothing to update if the entity doesn't exist
                return;
            }

            // Copy incoming values onto the tracked entity to avoid duplicate tracking instances
            _context.Entry(tracked).CurrentValues.SetValues(patient);
            await _context.SaveChangesAsync();
        }

        public async Task DeletePatientAsync(int id)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient != null)
            {
                _context.Patients.Remove(patient);
                await _context.SaveChangesAsync();
            }
        }
    }
}
