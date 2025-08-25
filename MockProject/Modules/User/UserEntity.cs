

namespace MockProject.Modules.User
{
    public class UserEntity
    {
        public int Id { get; set; }
        public required string UserName { get; set; }
        public required string Password { get; set; }
        public int? PatientId { get; set; }
        public UserRole Role { get; set; }
    }

    public enum UserRole
    {
        Admin,
        Doctor,
        Guest,
        Staff,
        User
    }
}
