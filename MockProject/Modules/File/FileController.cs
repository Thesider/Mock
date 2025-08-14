using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace MockProject.Modules.File
{
    [ApiController]
    [Route("file")]
    public class FileController : ControllerBase
    {
        private readonly IFileServices _fileServices;
        private readonly IValidator<FileEntity> _validator;
        private readonly ILogger<FileController> _logger;

        public FileController(IFileServices fileServices, IValidator<FileEntity> validator, ILogger<FileController> logger)
        {
            _fileServices = fileServices;
            _validator = validator;
            _logger = logger;
        }


        /// axios: axios.post('/file', fileData)
        /// curl: curl -X POST http://localhost:5000/file -H "Content-Type: application/json" -d "{\"name\":\"test.txt\",\"content\":\"abc\"}"
        [HttpPost]
        public async Task<IActionResult> AddFile([FromBody] FileEntity file)
        {
            var validationResult = await _validator.ValidateAsync(file);
            if (!validationResult.IsValid)
            {
                _logger.LogWarning("Validation failed for AddFile: {@Errors}", validationResult.Errors);
                return BadRequest(validationResult.Errors);
            }

            try
            {
                await _fileServices.AddFileAsync(file);
                _logger.LogInformation("File created with id {Id}", file.Id);
                return CreatedAtAction(nameof(GetFileById), new { id = file.Id }, file);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while saving the file.");
                return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred while saving the file. {ex.Message}");
            }
        }

        /// axios: axios.get(`/file/${id}`)
        /// curl: curl http://localhost:5000/file/1
        [HttpGet("{id}")]
        public async Task<IActionResult> GetFileById(int id)
        {
            try
            {
                var file = await _fileServices.GetFileByIdAsync(id);
                if (file == null)
                {
                    _logger.LogWarning("File with id {Id} not found.", id);
                    return NotFound();
                }
                _logger.LogInformation("File with id {Id} retrieved.", id);
                return Ok(file);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving the file.");
                return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred while retrieving the file. {ex.Message}");
            }
        }


        /// axios: axios.get('/file')
        /// curl: curl http://localhost:5000/file
        [HttpGet]
        public async Task<IActionResult> GetAllFiles()
        {
            try
            {
                var files = await _fileServices.GetAllFilesAsync();
                if (files == null || !files.Any())
                {
                    _logger.LogInformation("No files found.");
                    return NotFound();
                }
                _logger.LogInformation("All files retrieved.");
                return Ok(files);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving files.");
                return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred while retrieving files. {ex.Message}");
            }
        }


        /// axios: axios.put(`/file/${id}`, fileData)
        /// curl: curl -X PUT http://localhost:5000/file/1 -H "Content-Type: application/json" -d "{\"name\":\"updated.txt\",\"content\":\"xyz\"}"
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFile(int id, [FromBody] FileEntity file)
        {
            var validationResult = await _validator.ValidateAsync(file);
            if (!validationResult.IsValid)
            {
                _logger.LogWarning("Validation failed for UpdateFile: {@Errors}", validationResult.Errors);
                return BadRequest(validationResult.Errors);
            }

            try
            {
                var existingFile = await _fileServices.GetFileByIdAsync(id);
                if (existingFile == null)
                {
                    _logger.LogWarning("File with id {Id} not found for update.", id);
                    return NotFound();
                }

                file.Id = id;
                await _fileServices.UpdateFileAsync(file);
                _logger.LogInformation("File with id {Id} updated.", id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating the file.");
                return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred while updating the file. {ex.Message}");
            }
        }


        /// axios: axios.delete(`/file/${id}`)
        /// curl: curl -X DELETE http://localhost:5000/file/1
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFile(int id)
        {
            try
            {
                var file = await _fileServices.GetFileByIdAsync(id);
                if (file == null)
                {
                    _logger.LogWarning("File with id {Id} not found for deletion.", id);
                    return NotFound();
                }

                await _fileServices.DeleteFileAsync(id);
                _logger.LogInformation("File with id {Id} deleted.", id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting the file.");
                return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred while deleting the file. {ex.Message}");
            }
        }
    }
}