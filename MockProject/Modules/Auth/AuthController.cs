using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MockProject.Auth;
using System.Security.Claims;

namespace MockProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        /// <summary>
        /// Login with username and password
        /// </summary>
        /// <param name="request">Login credentials</param>
        /// <returns>JWT token and user information</returns>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.LoginAsync(request.Username, request.Password);

            if (!result.Success)
            {
                return Unauthorized(new { message = result.ErrorMessage });
            }

            return Ok(new
            {
                token = result.Token,
                refreshToken = result.RefreshToken,
                expiresAt = result.ExpiresAt,
                user = new
                {
                    id = result.User!.Id,
                    username = result.User.UserName,
                    role = result.User.Role.ToString()
                }
            });
        }

        /// <summary>
        /// Register a new user
        /// </summary>
        /// <param name="request">Registration details</param>
        /// <returns>JWT token and user information</returns>
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.RegisterAsync(request);

            if (!result.Success)
            {
                return BadRequest(new { message = result.ErrorMessage });
            }

            return Ok(new
            {
                token = result.Token,
                refreshToken = result.RefreshToken,
                expiresAt = result.ExpiresAt,
                user = new
                {
                    id = result.User!.Id,
                    username = result.User.UserName,
                    role = result.User.Role.ToString()
                }
            });
        }

        /// <summary>
        /// Get current user information
        /// </summary>
        /// <returns>Current user details</returns>
        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            var user = await _authService.GetCurrentUserAsync(User);

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            return Ok(new
            {
                id = user.Id,
                username = user.UserName,
                role = user.Role.ToString()
            });
        }

        /// <summary>
        /// Refresh JWT token
        /// </summary>
        /// <param name="request">Refresh token</param>
        /// <returns>New JWT token</returns>
        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            var result = await _authService.RefreshTokenAsync(request.Token);

            if (!result.Success)
            {
                return Unauthorized(new { message = result.ErrorMessage });
            }

            return Ok(new
            {
                token = result.Token,
                refreshToken = result.RefreshToken,
                expiresAt = result.ExpiresAt
            });
        }

        /// <summary>
        /// Logout (client-side token removal)
        /// </summary>
        /// <returns>Success message</returns>
        [HttpPost("logout")]
        [Authorize]
        public IActionResult Logout()
        {
            // In a real application, you might want to blacklist the token
            // For now, we'll just return success as the client will remove the token
            return Ok(new { message = "Logged out successfully" });
        }

        /// <summary>
        /// Validate if token is still valid
        /// </summary>
        /// <param name="request">Token to validate</param>
        /// <returns>Validation result</returns>
        [HttpPost("validate")]
        public async Task<IActionResult> ValidateToken([FromBody] ValidateTokenRequest request)
        {
            var isValid = await _authService.ValidateTokenAsync(request.Token);
            return Ok(new { isValid });
        }
    }

    public class RefreshTokenRequest
    {
        public required string Token { get; set; }
    }

    public class ValidateTokenRequest
    {
        public required string Token { get; set; }
    }
}