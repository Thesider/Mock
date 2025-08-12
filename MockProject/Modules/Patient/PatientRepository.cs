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

        public async Task<PatientEntity> GetPatientByIdAsync(int id)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null)
            {
                throw new KeyNotFoundException($"Patient with ID {id} not found.");
            }
            return patient;
        }

        public async Task<PatientEntity> GetPatientByNameAsync(string name)
        {
            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.Name == name);
            if (patient == null)
            {
                throw new KeyNotFoundException($"Patient with Name {name} not found.");
            }
            return patient;
        }

        public async Task<IEnumerable<PatientEntity>> GetAllPatientsAsync()
        {
            return await _context.Patients.ToListAsync();
        }

        public async Task UpdatePatientAsync(PatientEntity patient)
        {
            _context.Patients.Update(patient);
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