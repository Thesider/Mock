
using System.Linq.Expressions;

namespace MockProject.Modules.Doctor
{
    public interface IDoctorService
    {
        Task AddDoctorAsync(DoctorEntity doctor);
        Task<DoctorEntity> GetDoctorByIdAsync(int id);
        Task<IEnumerable<DoctorEntity>> GetAllDoctorsAsync();
        Task<IEnumerable<T>> GetDoctorPropertyAsync<T>(Expression<Func<DoctorEntity, T>> selector);
        Task UpdateDoctorAsync(DoctorEntity doctor);
        Task DeleteDoctorAsync(int id);
    }
}
