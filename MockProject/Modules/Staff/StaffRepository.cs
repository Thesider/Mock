using MockProject.Data;
using Microsoft.EntityFrameworkCore;

namespace MockProject.Modules.Staff
{
    public class StaffRepository : IStaffRepository
    {
        private readonly MockDbContext _context;

        public StaffRepository(MockDbContext context)
        {
            _context = context;
        }

        public async Task AddStaffAsync(StaffEntity staff)
        {
            _context.Add(staff);
            await _context.SaveChangesAsync();
        }

        public async Task<StaffEntity?> GetStaffByIdAsync(int id)
        {
            return await _context.Set<StaffEntity>().FindAsync(id);
        }

        public async Task<IEnumerable<StaffEntity>> GetAllStaffAsync()
        {
            return await _context.Set<StaffEntity>().ToListAsync();
        }

        public async Task UpdateStaffAsync(StaffEntity staff)
        {
            _context.Update(staff);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteStaffAsync(int id)
        {
            var staff = await GetStaffByIdAsync(id);
            if (staff != null)
            {
                _context.Remove(staff);
                await _context.SaveChangesAsync();
            }
        }
    }
}
