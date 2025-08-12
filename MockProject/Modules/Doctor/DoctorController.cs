using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using MockProject.Modules.Doctor;

namespace MockProject.Modules.Doctor
{
    [ApiController]
    [Route("doctors")]
    public class DoctorController : ControllerBase
    {
        private readonly IDoctorService _doctorService;
        private readonly IValidator<DoctorEntity> _validator;
        private readonly ILogger<DoctorController> _logger;

        public DoctorController(IDoctorService doctorService, IValidator<DoctorEntity> validator, ILogger<DoctorController> logger)
        {
            _doctorService = doctorService;
            _validator = validator;
            _logger = logger;
        }
        //axios: axios.post('/doctors', doctor)
        //curl: curl -X POST http://localhost:5000/doctors -H "Content-Type: application/json" -d "{\"name\":\"Dr. Smith\",\"specialty\":\"Cardiology\"}"
        [HttpPost]
        public async Task<IActionResult> AddDoctor(DoctorEntity doctor)
        {
            var validationResult = await _validator.ValidateAsync(doctor);
            if (!validationResult.IsValid)
            {
                _logger.LogWarning("Invalid doctor data: {Errors}", validationResult.Errors);
                return BadRequest(validationResult.Errors);
            }
            try
            {
                await _doctorService.AddDoctorAsync(doctor);
                _logger.LogInformation("Doctor created with id {Id}", doctor.Id);
                return CreatedAtAction(nameof(GetDoctorById), new { id = doctor.Id }, doctor);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while adding the doctor.");
                return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred while adding the doctor. {ex.Message}");
            }
        }
        //axios: axios.get(`/doctors/${id}`)
        //curl: curl http://localhost:5000/doctors/1 
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDoctorById(int id)
        {
            try
            {
                var doctor = await _doctorService.GetDoctorByIdAsync(id);
                if (doctor == null)
                {
                    _logger.LogWarning("Doctor with id {Id} not found.", id);
                    return NotFound();
                }
                return Ok(doctor);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving the doctor.");
                return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred while retrieving the doctor. {ex.Message}");
            }
        }
        //axios: axios.get('/doctors/search', { params: { name, specialty, department, status } })
        //curl: curl -G http://localhost:5000/doctors/search --data-urlencode "name=Dr. Smith" --data-urlencode "specialty=Cardiology"
        [HttpGet("Search")]
        public async Task<IActionResult> SearchDoctors([FromQuery] string? name = null, [FromQuery] string? specialty = null, [FromQuery] string? department = null, [FromQuery] Status? status = null)
        {
            try
            {
                var doctors = await _doctorService.GetDoctorPropertyAsync(d => new { d.Name, d.Specialty, d.Department, d.Status });
                if (!string.IsNullOrEmpty(name))
                {
                    doctors = doctors.Where(d => d.Name.Contains(name, StringComparison.OrdinalIgnoreCase));
                }
                if (!string.IsNullOrEmpty(specialty))
                {
                    doctors = doctors.Where(d => d.Specialty.Contains(specialty, StringComparison.OrdinalIgnoreCase));
                }
                if (!string.IsNullOrEmpty(department))
                {
                    doctors = doctors.Where(d => d.Department.Contains(department, StringComparison.OrdinalIgnoreCase));
                }
                if (status.HasValue)
                {
                    doctors = doctors.Where(d => d.Status == status.Value);
                }
                return Ok(doctors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while searching for doctors.");
                return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred while searching for doctors. {ex.Message}");
            }
        }
        //axios: axios.get('/doctors')
        //curl: curl http://localhost:5000/doctors
        [HttpGet]
        public async Task<IActionResult> GetAllDoctors()
        {
            try
            {
                var doctors = await _doctorService.GetAllDoctorsAsync();
                if (doctors == null || !doctors.Any())
                {
                    _logger.LogInformation("No doctors found.");
                    return NotFound();
                }
                return Ok(doctors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving all doctors.");
                return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred while retrieving all doctors. {ex.Message}");
            }
        }
        /// axios: axios.put(`/doctors/${id}`, doctor)
        /// curl: curl -X PUT http://localhost:5000/doctors/1 -H "Content-Type: application/json" -d "{\"name\":\"Dr. Smith\",\"specialty\":\"Cardiology\"}"
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDoctor(int id, [FromBody] DoctorEntity doctor)
        {
            var validationResult = await _validator.ValidateAsync(doctor);
            if (!validationResult.IsValid)
            {
                _logger.LogWarning("Validation failed for UpdateDoctor: {@Errors}", validationResult.Errors);
                return BadRequest(validationResult.Errors);
            }

            try
            {
                doctor.Id = id;
                await _doctorService.UpdateDoctorAsync(doctor);
                _logger.LogInformation("Doctor with id {Id} updated.", id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating the doctor.");
                return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred while updating the doctor. {ex.Message}");
            }
        }
        /// axios: axios.delete(`/doctors/${id}`)
        /// curl: curl -X DELETE http://localhost:5000/doctors/1
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDoctor(int id)
        {
            try
            {
                await _doctorService.DeleteDoctorAsync(id);
                _logger.LogInformation("Doctor with id {Id} deleted.", id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting the doctor.");
                return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred while deleting the doctor. {ex.Message}");
            }
        }
    }
}
