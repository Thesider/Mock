using Microsoft.AspNetCore.Mvc;

using System.Linq;
using MockProject.Modules.Doctor;
using MockProject.Modules.Patient;
using Microsoft.AspNetCore.Authorization;
using MockProject.Auth;
namespace MockProject.Modules.Appointment
{
    [ApiController]
    [Route("appointments")]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;
        private readonly IDoctorService _doctorService;
        private readonly IPatientService _patientService;

        public AppointmentController(IAppointmentService appointmentService, IDoctorService doctorService, IPatientService patientService)
        {
            _appointmentService = appointmentService;
            _doctorService = doctorService;
            _patientService = patientService;
        }

        // axios: axios.post('/appointments', appointment)
        // curl: curl -X POST http://localhost:5000/appointments -H "Content-Type: application/json" -d "{\"doctorId\":1,\"patientId\":2,\"startTime\":\"2024-08-12T10:00:00\",\"endTime\":\"2024-08-12T10:30:00\"}"
        [HttpPost]
        public async Task<IActionResult> CreateAppointment(AppointmentCreateDto dto)
        {
            // Map DTO to entity (avoid binding navigation properties directly)
            var appointment = new AppointmentEntity
            {
                DoctorId = dto.DoctorId,
                PatientId = dto.PatientId,
                Date = dto.Date,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime,
                Description = dto.Description,
                Location = dto.Location,
                Status = dto.Status
            };

            // Authorization: temporarily bypassed (dev mode) - removed ownership check

            var validationResult = await new AppointmentValidator().ValidateAsync(appointment);
            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors);
            }

            // Ensure referenced patient exists to avoid FK violation
            var patient = await _patientService.GetPatientByIdAsync(appointment.PatientId);
            if (patient == null)
            {
                return BadRequest($"Patient with id {appointment.PatientId} does not exist.");
            }

            // Ensure referenced doctor exists
            var doctor = await _doctorService.GetDoctorByIdAsync(appointment.DoctorId);
            if (doctor == null)
            {
                return BadRequest($"Doctor with id {appointment.DoctorId} does not exist.");
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

            // Attach existing entities so EF treats them as existing (prevents insert attempts)
            appointment.Patient = patient;
            appointment.Doctor = doctor;

            await _appointmentService.CreateAppointmentAsync(appointment);

            var bookedSlot = new BookedSlotDto
            {
                DoctorName = doctor.Name ?? "Unknown",
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

            // Authorization check temporarily bypassed (dev mode)

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

            // Authorization check temporarily bypassed (dev mode)

            await _appointmentService.DeleteAppointmentAsync(id);
            return NoContent();
        }
    }
}
