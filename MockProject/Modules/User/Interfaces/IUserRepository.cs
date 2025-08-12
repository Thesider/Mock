
namespace MockProject.Modules.User
{
    public interface IUserRepository
    {
        Task AddUserAsync(UserEntity user);
        Task<UserEntity> GetUserByIdAsync(int id);
        Task<IEnumerable<UserEntity>> GetAllUsersAsync();
        Task UpdateUserAsync(UserEntity user);
        Task DeleteUserAsync(int id);
    }
}
