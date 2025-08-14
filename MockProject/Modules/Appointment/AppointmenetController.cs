using Microsoft.AspNetCore.Mvc;

using System.Linq;
using MockProject.Modules.Doctor;
using MockProject.Modules.Patient;
namespace MockProject.Modules.Appointment
{
    [ApiController]
    [Route("appointments")]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;

        public AppointmentController(IAppointmentService appointmentService)
        {
            _appointmentService = appointmentService;
        }

        // axios: axios.post('/appointments', appointment)
        // curl: curl -X POST http://localhost:5000/appointments -H "Content-Type: application/json" -d "{\"doctorId\":1,\"patientId\":2,\"startTime\":\"2024-08-12T10:00:00\",\"endTime\":\"2024-08-12T10:30:00\"}"
        [HttpPost]
        public async Task<IActionResult> CreateAppointment(AppointmentEntity appointment)
        {
            var validationResult = await new AppointmentValidator().ValidateAsync(appointment);
            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors);
            }

            var appointments = await _appointmentService.GetAllAppointmentsAsync();
            bool doctorConflict = appointments.Any(a =>
                a.DoctorId == appointment.DoctorId &&
                ((appointment.StartTime < a.EndTime) && (appointment.EndTime > a.StartTime))
            );
            if (doctorConflict)
            {
                return Conflict("This doctor already has an appointment during the selected time slot.");
            }

            bool patientConflict = appointments.Any(a =>
                a.PatientId == appointment.PatientId &&
                ((appointment.StartTime < a.EndTime) && (appointment.EndTime > a.StartTime))
            );
            if (patientConflict)
            {
                return Conflict("This patient already has an appointment during the selected time slot.");
            }

            await _appointmentService.CreateAppointmentAsync(appointment);

            string doctorName = appointment.Doctor?.Name ?? "Unknown";
            string patientName = appointment.Patient?.Name ?? "Unknown";

            var bookedSlot = new BookedSlotDto
            {
                DoctorName = doctorName,
                PatientName = patientName,
                StartTime = appointment.StartTime,
                EndTime = appointment.EndTime
            };

            return CreatedAtAction(nameof(GetAppointment), new { id = appointment.Id }, bookedSlot);
        }

        // axios: axios.get(`/appointments/${id}`)
        // curl: curl http://localhost:5000/appointments/1
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAppointment(int id)
        {
            var appointment = await _appointmentService.GetAppointmentByIdAsync(id);
            if (appointment == null)
            {
                return NotFound();
            }

            return Ok(appointment);
        }

        // axios: axios.get('/appointments')
        // curl: curl http://localhost:5000/appointments
        [HttpGet]
        public async Task<IActionResult> GetAllAppointments()
        {
            var appointments = await _appointmentService.GetAllAppointmentsAsync();
            return Ok(appointments);
        }

        // axios: axios.put(`/appointments/${id}`, appointment)
        // curl: curl -X PUT http://localhost:5000/appointments/1 -H "Content-Type: application/json" -d "{\"doctorId\":1,\"patientId\":2,\"startTime\":\"2024-08-12T10:00:00\",\"endTime\":\"2024-08-12T10:30:00\"}"
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAppointment(int id, AppointmentEntity appointment)
        {
            if (id != appointment.Id)
            {
                return BadRequest("Appointment ID mismatch.");
            }

            var validationResult = await new AppointmentValidator().ValidateAsync(appointment);
            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors);
            }

            await _appointmentService.UpdateAppointmentAsync(appointment);
            return NoContent();
        }

        // axios: axios.delete(`/appointments/${id}`)
        // curl: curl -X DELETE http://localhost:5000/appointments/1
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            var appointment = await _appointmentService.GetAppointmentByIdAsync(id);
            if (appointment == null)
            {
                return NotFound();
            }

            await _appointmentService.DeleteAppointmentAsync(id);
            return NoContent();
        }
    }
}