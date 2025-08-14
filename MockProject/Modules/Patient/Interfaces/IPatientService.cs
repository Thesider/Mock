namespace MockProject.Modules.Patient
{
    public interface IPatientService
    {
        Task AddPatientAsync(PatientEntity patient);
        Task<PatientEntity> GetPatientByIdAsync(int id);
        Task<PatientEntity> GetPatientByNameAsync(string name);
        Task<IEnumerable<PatientEntity>> GetAllPatientsAsync();
        Task UpdatePatientAsync(PatientEntity patient);
        Task DeletePatientAsync(int id);
    }
}