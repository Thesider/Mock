
using Microsoft.EntityFrameworkCore;
using MockProject.Data;

namespace MockProject.Modules.User
{
    public class UserRepository : IUserRepository
    {
        private readonly MockDbContext _context;

        public UserRepository(MockDbContext context)
        {
            _context = context;
        }

        public async Task AddUserAsync(UserEntity user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }

        public async Task<UserEntity> GetUserByIdAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                throw new Exception($"User with id {id} not found.");
            }
            return user;
        }
        public async Task<IEnumerable<UserEntity>> GetAllUsersAsync()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task UpdateUserAsync(UserEntity user)
        {
            var existingUser = await _context.Users.FindAsync(user.Id);
            if (existingUser != null)
            {
                _context.Entry(existingUser).CurrentValues.SetValues(user);
                await _context.SaveChangesAsync();
            }
        }
        public async Task DeleteUserAsync(int id)
        {
            var user = await GetUserByIdAsync(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
            }
        }
    }

}