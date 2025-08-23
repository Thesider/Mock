using FluentValidation;
using Microsoft.AspNetCore.Mvc;

namespace MockProject.Modules.Patient
{
    [ApiController]
    [Route("Patient")]
    public class PatientController : ControllerBase
    {
        private readonly IPatientRepository _patientRepository;
        private readonly IValidator<PatientEntity> _validator;

        public PatientController(IPatientRepository patientRepository, IValidator<PatientEntity> validator)
        {
            _patientRepository = patientRepository;
            _validator = validator;
        }


        // axios: axios.post('/Patient', patient)
        // curl: curl -X POST http://localhost:5000/Patient -H "Content-Type: application/json" -d "{\"name\":\"Jane Doe\"}"
        [HttpPost]
        public async Task<IActionResult> AddPatient(PatientEntity patient)
        {
            var validationResult = await _validator.ValidateAsync(patient);
            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors);
            }

            await _patientRepository.AddPatientAsync(patient);
            return CreatedAtAction(nameof(GetPatientById), new { id = patient.Id }, patient);
        }

        // axios: axios.get(`/Patient/${id}`)
        [HttpGet]
        public async Task<IActionResult> GetAllPatients()
        {
            var patients = await _patientRepository.GetAllPatientsAsync();
            return Ok(patients);
        }
        // curl: curl http://localhost:5000/Patient/1
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetPatientById(int id)
        {
            var patient = await _patientRepository.GetPatientByIdAsync(id);
            if (patient == null)
            {
                return NotFound();
            }
            return Ok(patient);
        }
        // axios: axios.get(`/Patient/by-name/${name}`)
        // curl: curl http://localhost:5000/Patient/by-name/Jane
        [HttpGet("by-name/{name}")]
        public async Task<IActionResult> GetPatientByName(string name)
        {
            var patient = await _patientRepository.GetPatientByNameAsync(name);
            if (patient == null)
            {
                return NotFound();
            }
            return Ok(patient);
        }

        // axios: axios.put(`/Patient/${id}`, patient)
        // curl: curl -X PUT http://localhost:5000/Patient/1 -H "Content-Type: application/json" -d "{\"name\":\"Jane Doe\"}"
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePatient(int id, PatientEntity patient)
        {
            if (id != patient.Id)
            {
                return BadRequest();
            }

            var validationResult = await _validator.ValidateAsync(patient);
            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors);
            }

            // Ensure the patient exists before updating
            var existing = await _patientRepository.GetPatientByIdAsync(id);
            if (existing == null)
            {
                return NotFound();
            }

            await _patientRepository.UpdatePatientAsync(patient);
            return NoContent();
        }

        // axios: axios.delete(`/Patient/${id}`)
        // curl: curl -X DELETE http://localhost:5000/Patient/1
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePatient(int id)
        {
            var patient = await _patientRepository.GetPatientByIdAsync(id);
            if (patient == null)
            {
                return NotFound();
            }

            await _patientRepository.DeletePatientAsync(id);
            return NoContent();
        }

    }
}
