using System.Linq.Expressions;

namespace MockProject.Modules.Doctor
{
    public class DoctorService : IDoctorService
    {
        private readonly IDoctorRepository _doctorRepository;

        public DoctorService(IDoctorRepository doctorRepository)
        {
            _doctorRepository = doctorRepository;
        }

        public async Task AddDoctorAsync(DoctorEntity doctor)
        {
            await _doctorRepository.AddDoctorAsync(doctor);
        }

        public async Task<DoctorEntity> GetDoctorByIdAsync(int id)
        {
            return await _doctorRepository.GetDoctorByIdAsync(id);
        }
        public async Task<IEnumerable<T>> GetDoctorPropertyAsync<T>(Expression<Func<DoctorEntity, T>> selector)
        {
            return await _doctorRepository.GetDoctorPropertyAsync(selector);
        }

        public async Task<IEnumerable<DoctorEntity>> GetAllDoctorsAsync()
        {
            return await _doctorRepository.GetAllDoctorsAsync();
        }

        public async Task UpdateDoctorAsync(DoctorEntity doctor)
        {
            await _doctorRepository.UpdateDoctorAsync(doctor);
        }

        public async Task DeleteDoctorAsync(int id)
        {
            await _doctorRepository.DeleteDoctorAsync(id);
        }
    }
}
