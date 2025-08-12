using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace MockProject.Modules.User
{
    [ApiController]
    [Route("user")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IValidator<UserEntity> _validator;
        private readonly ILogger<UserController> _logger;

        public UserController(IUserService userService, IValidator<UserEntity> validator, ILogger<UserController> logger)
        {
            _userService = userService;
            _validator = validator;
            _logger = logger;
        }

        // axios.post('/user', userData)
        // curl -X POST http://localhost:5000/user -H "Content-Type: application/json" -d "{\"name\":\"test\",\"email\":\"test@example.com\"}"
        [HttpPost]
        public async Task<IActionResult> RegisterUser([FromBody] UserEntity user)
        {
            var validationResult = _validator.Validate(user);
            if (!validationResult.IsValid)
            {
                _logger.LogWarning("Validation failed for RegisterUser: {@Errors}", validationResult.Errors);
                return BadRequest(validationResult.Errors);
            }

            try
            {
                await _userService.RegisterUserAsync(user);
                _logger.LogInformation("User created with id {Id}", user.Id);
                return CreatedAtAction(nameof(GetUserById), new { id = user.Id }, user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while registering the user.");
                return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred while registering the user. {ex.Message}");
            }
        }

        // axios.get(`/user/${id}`)
        // curl http://localhost:5000/user/1
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            try
            {
                var user = await _userService.GetUserByIdAsync(id);
                if (user == null)
                {
                    _logger.LogWarning("User with id {Id} not found.", id);
                    return NotFound();
                }
                _logger.LogInformation("User with id {Id} retrieved.", id);
                return Ok(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving the user.");
                return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred while retrieving the user. {ex.Message}");
            }
        }

        // axios.get('/user')
        // curl http://localhost:5000/user
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var users = await _userService.GetAllUsersAsync();
                _logger.LogInformation("All users retrieved.");
                return Ok(users);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving users.");
                return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred while retrieving users. {ex.Message}");
            }
        }

        // axios.put(`/user/${id}`, userData)
        // curl -X PUT http://localhost:5000/user/1 -H "Content-Type: application/json" -d "{\"name\":\"updated\",\"email\":\"updated@example.com\"}"
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UserEntity user)
        {
            var validationResult = _validator.Validate(user);
            if (!validationResult.IsValid)
            {
                _logger.LogWarning("Validation failed for UpdateUser: {@Errors}", validationResult.Errors);
                return BadRequest(validationResult.Errors);
            }

            try
            {
                var existingUser = await _userService.GetUserByIdAsync(id);
                if (existingUser == null)
                {
                    _logger.LogWarning("User with id {Id} not found for update.", id);
                    return NotFound();
                }

                user.Id = id;
                await _userService.UpdateUserAsync(user);
                _logger.LogInformation("User with id {Id} updated.", id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating the user.");
                return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred while updating the user. {ex.Message}");
            }
        }

        // axios.delete(`/user/${id}`)
        // curl -X DELETE http://localhost:5000/user/1
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                var user = await _userService.GetUserByIdAsync(id);
                if (user == null)
                {
                    _logger.LogWarning("User with id {Id} not found for deletion.", id);
                    return NotFound();
                }

                await _userService.DeleteUserAsync(id);
                _logger.LogInformation("User with id {Id} deleted.", id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting the user.");
                return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred while deleting the user. {ex.Message}");
            }
        }
    }
}