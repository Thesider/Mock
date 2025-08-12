namespace MockProject.Modules.Patient
{
    public class PatientService : IPatientService
    {
        private readonly IPatientRepository _patientRepository;

        public PatientService(IPatientRepository patientRepository)
        {
            _patientRepository = patientRepository;
        }

        public Task AddPatientAsync(PatientEntity patient)
        {
            return _patientRepository.AddPatientAsync(patient);
        }

        public Task<PatientEntity> GetPatientByIdAsync(int id)
        {
            return _patientRepository.GetPatientByIdAsync(id);
        }

        public Task<PatientEntity> GetPatientByNameAsync(string name)
        {
            return _patientRepository.GetPatientByNameAsync(name);
        }

        public Task<IEnumerable<PatientEntity>> GetAllPatientsAsync()
        {
            return _patientRepository.GetAllPatientsAsync();
        }

        public Task UpdatePatientAsync(PatientEntity patient)
        {
            return _patientRepository.UpdatePatientAsync(patient);
        }

        public Task DeletePatientAsync(int id)
        {
            return _patientRepository.DeletePatientAsync(id);
        }
    }
}