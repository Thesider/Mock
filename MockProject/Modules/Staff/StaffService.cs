
namespace MockProject.Modules.Staff
{
    public class StaffService : IStaffService
    {
        private readonly IStaffRepository _staffRepository;

        public StaffService(IStaffRepository staffRepository)
        {
            _staffRepository = staffRepository;
        }

        public Task AddStaffAsync(StaffEntity staff) => _staffRepository.AddStaffAsync(staff);
        public Task<StaffEntity?> GetStaffByIdAsync(int id) => _staffRepository.GetStaffByIdAsync(id);
        public Task<IEnumerable<StaffEntity>> GetAllStaffAsync() => _staffRepository.GetAllStaffAsync();
        public Task UpdateStaffAsync(StaffEntity staff) => _staffRepository.UpdateStaffAsync(staff);
        public Task DeleteStaffAsync(int id) => _staffRepository.DeleteStaffAsync(id);
    }
}
