using System.Collections.Generic;
using System.Threading.Tasks;

namespace MockProject.Modules.Patient
{
    public interface IPatientRepository
    {
        Task<PatientEntity?> GetPatientByIdAsync(int id);
        Task<PatientEntity?> GetPatientByNameAsync(string name);
        Task<IEnumerable<PatientEntity>> GetAllPatientsAsync();
        Task AddPatientAsync(PatientEntity patient);
        Task UpdatePatientAsync(PatientEntity patient);
        Task DeletePatientAsync(int id);
    }
}
