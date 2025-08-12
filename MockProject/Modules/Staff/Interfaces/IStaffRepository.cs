using System.Collections.Generic;
using System.Threading.Tasks;

namespace MockProject.Modules.Staff
{
    public interface IStaffRepository
    {
        Task AddStaffAsync(StaffEntity staff);
        Task<StaffEntity?> GetStaffByIdAsync(int id);
        Task<IEnumerable<StaffEntity>> GetAllStaffAsync();
        Task UpdateStaffAsync(StaffEntity staff);
        Task DeleteStaffAsync(int id);
    }
}
