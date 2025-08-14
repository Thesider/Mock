namespace MockProject.Modules.User
{


    public interface IUserService
    {
        Task RegisterUserAsync(UserEntity user);
        Task<UserEntity> GetUserByIdAsync(int id);
        Task<IEnumerable<UserEntity>> GetAllUsersAsync();
        Task UpdateUserAsync(UserEntity user);
        Task DeleteUserAsync(int id);
    }
}