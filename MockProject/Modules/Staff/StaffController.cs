using FluentValidation;
using Microsoft.AspNetCore.Mvc;

namespace MockProject.Modules.Staff
{
    [ApiController]
    [Route("staff")]
    public class StaffController : ControllerBase
    {
        private readonly IStaffService _staffService;
        private readonly IValidator<StaffEntity> _validator;

        public StaffController(IStaffService staffService, IValidator<StaffEntity> validator)
        {
            _staffService = staffService;
            _validator = validator;
        }

        // axios: axios.post('/staff', staff)
        // curl: curl -X POST http://localhost:5000/staff -H "Content-Type: application/json" -d "{\"name\":\"John Doe\"}"
        [HttpPost]
        public async Task<IActionResult> AddStaff(StaffEntity staff)
        {
            var validationResult = await _validator.ValidateAsync(staff);
            if (!validationResult.IsValid)
                return BadRequest(validationResult.Errors);

            await _staffService.AddStaffAsync(staff);
            return CreatedAtAction(nameof(GetStaffById), new { id = staff.Id }, staff);
        }

        // axios: axios.get(`/staff/${id}`)
        // curl: curl http://localhost:5000/staff/1
        [HttpGet("{id}")]
        public async Task<IActionResult> GetStaffById(int id)
        {
            var staff = await _staffService.GetStaffByIdAsync(id);
            if (staff == null) return NotFound();
            return Ok(staff);
        }

        // axios: axios.get('/staff')
        // curl: curl http://localhost:5000/staff
        [HttpGet]
        public async Task<IActionResult> GetAllStaff()
        {
            var staff = await _staffService.GetAllStaffAsync();
            return Ok(staff);
        }

        // axios: axios.put(`/staff/${id}`, staff)
        // curl: curl -X PUT http://localhost:5000/staff/1 -H "Content-Type: application/json" -d "{\"name\":\"John Doe\"}"
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStaff(int id, StaffEntity staff)
        {
            if (id != staff.Id) return BadRequest("Staff ID mismatch.");
            var validationResult = await _validator.ValidateAsync(staff);
            if (!validationResult.IsValid)
                return BadRequest(validationResult.Errors);

            await _staffService.UpdateStaffAsync(staff);
            return NoContent();
        }

        // axios: axios.delete(`/staff/${id}`)
        // curl: curl -X DELETE http://localhost:5000/staff/1
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStaff(int id)
        {
            await _staffService.DeleteStaffAsync(id);
            return NoContent();
        }
    }
}
