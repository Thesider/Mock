using MockProject.Modules.User;
using System.Security.Claims;

namespace MockProject.Auth
{
    public interface IAuthService
    {
        Task<AuthResult> LoginAsync(string username, string password);
        Task<AuthResult> RegisterAsync(RegisterRequest request);
        Task<UserEntity?> GetCurrentUserAsync(ClaimsPrincipal user);
        Task<bool> ValidateTokenAsync(string token);
        Task<AuthResult> RefreshTokenAsync(string token);
    }

    public class AuthResult
    {
        public bool Success { get; set; }
        public string? Token { get; set; }
        public string? RefreshToken { get; set; }
        public UserEntity? User { get; set; }
        public string? ErrorMessage { get; set; }
        public DateTime? ExpiresAt { get; set; }
    }

    public class LoginRequest
    {
        public required string Username { get; set; }
        public required string Password { get; set; }
    }

    public class RegisterRequest
    {
        public required string Username { get; set; }
        public required string Password { get; set; }
        public required string ConfirmPassword { get; set; }
        public UserRole Role { get; set; } = UserRole.User;
    }
}