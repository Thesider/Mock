using Microsoft.IdentityModel.Tokens;
using MockProject.Modules.User;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace MockProject.Auth
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthService> _logger;

        public AuthService(
            IUserRepository userRepository,
            IConfiguration configuration,
            ILogger<AuthService> logger)
        {
            _userRepository = userRepository;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<AuthResult> LoginAsync(string username, string password)
        {
            try
            {
                // Find user by username
                var users = await _userRepository.GetAllUsersAsync();
                var user = users.FirstOrDefault(u => u.UserName.Equals(username, StringComparison.OrdinalIgnoreCase));

                if (user == null)
                {
                    _logger.LogWarning("Login attempt failed: User {Username} not found", username);
                    return new AuthResult
                    {
                        Success = false,
                        ErrorMessage = "Invalid username or password"
                    };
                }

                // Verify password (in production, use proper password hashing)
                if (!VerifyPassword(password, user.Password))
                {
                    _logger.LogWarning("Login attempt failed: Invalid password for user {Username}", username);
                    return new AuthResult
                    {
                        Success = false,
                        ErrorMessage = "Invalid username or password"
                    };
                }

                // Generate tokens
                var token = GenerateJwtToken(user);
                var refreshToken = GenerateRefreshToken();
                var expiresAt = DateTime.UtcNow.AddDays(7);

                _logger.LogInformation("User {Username} logged in successfully", username);

                return new AuthResult
                {
                    Success = true,
                    Token = token,
                    RefreshToken = refreshToken,
                    User = user,
                    ExpiresAt = expiresAt
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login for user {Username}", username);
                return new AuthResult
                {
                    Success = false,
                    ErrorMessage = "An error occurred during login"
                };
            }
        }

        public async Task<AuthResult> RegisterAsync(RegisterRequest request)
        {
            try
            {
                // Validate passwords match
                if (request.Password != request.ConfirmPassword)
                {
                    return new AuthResult
                    {
                        Success = false,
                        ErrorMessage = "Passwords do not match"
                    };
                }

                // Check if user already exists
                var existingUsers = await _userRepository.GetAllUsersAsync();
                if (existingUsers.Any(u => u.UserName.Equals(request.Username, StringComparison.OrdinalIgnoreCase)))
                {
                    return new AuthResult
                    {
                        Success = false,
                        ErrorMessage = "Username already exists"
                    };
                }

                // Create new user
                var user = new UserEntity
                {
                    UserName = request.Username,
                    Password = HashPassword(request.Password), // In production, use proper hashing
                    Role = request.Role
                };

                await _userRepository.AddUserAsync(user);

                _logger.LogInformation("New user {Username} registered successfully", request.Username);

                // Generate tokens for immediate login
                var token = GenerateJwtToken(user);
                var refreshToken = GenerateRefreshToken();

                return new AuthResult
                {
                    Success = true,
                    Token = token,
                    RefreshToken = refreshToken,
                    User = user,
                    ExpiresAt = DateTime.UtcNow.AddDays(7)
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during registration for user {Username}", request.Username);
                return new AuthResult
                {
                    Success = false,
                    ErrorMessage = "An error occurred during registration"
                };
            }
        }

        public async Task<UserEntity?> GetCurrentUserAsync(ClaimsPrincipal user)
        {
            try
            {
                var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    return null;
                }

                return await _userRepository.GetUserByIdAsync(userId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting current user");
                return null;
            }
        }

        public async Task<bool> ValidateTokenAsync(string token)
        {
            try
            {
                return await Task.Run(() =>
                {
                    var tokenHandler = new JwtSecurityTokenHandler();
                    var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]!);

                    tokenHandler.ValidateToken(token, new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(key),
                        ValidateIssuer = true,
                        ValidIssuer = _configuration["Jwt:Issuer"],
                        ValidateAudience = true,
                        ValidAudience = _configuration["Jwt:Audience"],
                        ValidateLifetime = true,
                        ClockSkew = TimeSpan.Zero
                    }, out SecurityToken validatedToken);

                    return true;
                });
            }
            catch
            {
                return false;
            }
        }

        public async Task<AuthResult> RefreshTokenAsync(string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]!);

                var principal = tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = _configuration["Jwt:Issuer"],
                    ValidateAudience = true,
                    ValidAudience = _configuration["Jwt:Audience"],
                    ValidateLifetime = false, // Don't validate lifetime for refresh
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var userIdClaim = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    return new AuthResult { Success = false, ErrorMessage = "Invalid token" };
                }

                var user = await _userRepository.GetUserByIdAsync(userId);
                if (user == null)
                {
                    return new AuthResult { Success = false, ErrorMessage = "User not found" };
                }

                var newToken = GenerateJwtToken(user);
                var newRefreshToken = GenerateRefreshToken();

                return new AuthResult
                {
                    Success = true,
                    Token = newToken,
                    RefreshToken = newRefreshToken,
                    User = user,
                    ExpiresAt = DateTime.UtcNow.AddDays(7)
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error refreshing token");
                return new AuthResult { Success = false, ErrorMessage = "Invalid token" };
            }
        }

        private string GenerateJwtToken(UserEntity user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]!);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(ClaimTypes.Role, user.Role.ToString()),
                    new Claim("username", user.UserName),
                    new Claim("role", user.Role.ToString())
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"]
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        private bool VerifyPassword(string password, string hashedPassword)
        {
            // For development - simple comparison
            // In production, use BCrypt or similar
            return password == hashedPassword;
        }

        private string HashPassword(string password)
        {
            // For development - return as is
            // In production, use BCrypt or similar
            return password;
        }
    }
}