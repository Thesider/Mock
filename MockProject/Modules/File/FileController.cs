using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using MockProject.Auth;

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

            if (file.PatientId > 0 && !AuthorizationHelpers.IsUserAllowedForPatient(User, file.PatientId))
            {
                _logger.LogWarning("Unauthorized attempt to add file for patient {PatientId}", file.PatientId);
                return Forbid();
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

                if (!AuthorizationHelpers.IsUserAllowedForPatient(User, file.PatientId))
                {
                    _logger.LogWarning("Unauthorized access to file {Id} with patient {PatientId}", id, file.PatientId);
                    return Forbid();
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

                if (!AuthorizationHelpers.IsUserAllowedForPatient(User, existingFile.PatientId))
                {
                    _logger.LogWarning("Unauthorized update attempt for file {Id} (patient {PatientId})", id, existingFile.PatientId);
                    return Forbid();
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

                if (!AuthorizationHelpers.IsUserAllowedForPatient(User, file.PatientId))
                {
                    _logger.LogWarning("Unauthorized delete attempt for file {Id} (patient {PatientId})", id, file.PatientId);
                    return Forbid();
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

        /// Upload file for patient medical records
        /// axios: const formData = new FormData(); formData.append('file', file); formData.append('patientId', patientId); axios.post('/file/upload', formData)
        /// curl: curl -X POST http://localhost:5000/file/upload -F "file=@document.pdf" -F "patientId=1"
        [HttpPost("upload")]
        public async Task<IActionResult> UploadFile(IFormFile file, [FromForm] int patientId)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    _logger.LogWarning("No file provided for upload.");
                    return BadRequest("No file provided");
                }

                if (!AuthorizationHelpers.IsUserAllowedForPatient(User, patientId))
                {
                    _logger.LogWarning("Unauthorized upload attempt for patient {PatientId}", patientId);
                    return Forbid();
                }

                var fileEntity = await _fileServices.SaveFileAsync(file, patientId);
                _logger.LogInformation("File {FileName} uploaded successfully with id {Id}", file.FileName, fileEntity.Id);

                return Ok(new
                {
                    id = fileEntity.Id,
                    fileName = fileEntity.FileName,
                    filePath = fileEntity.FilePath,
                    size = fileEntity.Size,
                    uploadedAt = fileEntity.UploadedAt,
                    patientId = fileEntity.PatientId,
                    message = "File uploaded successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while uploading the file.");
                return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred while uploading the file. {ex.Message}");
            }
        }

        /// Get files for a specific patient
        /// axios: axios.get(`/file/patient/${patientId}`)
        /// curl: curl http://localhost:5000/file/patient/1
        [HttpGet("patient/{patientId}")]
        public async Task<IActionResult> GetPatientFiles(int patientId)
        {
            try
            {
                if (!AuthorizationHelpers.IsUserAllowedForPatient(User, patientId))
                {
                    _logger.LogWarning("Unauthorized access to files for patient {PatientId}", patientId);
                    return Forbid();
                }

                var files = await _fileServices.GetFilesByPatientIdAsync(patientId);
                _logger.LogInformation("Retrieved {Count} files for patient {PatientId}", files.Count(), patientId);
                return Ok(files);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving patient files.");
                return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred while retrieving patient files. {ex.Message}");
            }
        }

        /// Download file by ID
        /// axios: axios.get(`/file/download/${fileId}`, { responseType: 'blob' })
        /// curl: curl http://localhost:5000/file/download/1 --output downloaded_file
        [HttpGet("download/{fileId}")]
        public async Task<IActionResult> DownloadFile(int fileId)
        {
            try
            {
                var fileEntity = await _fileServices.GetFileByIdAsync(fileId);
                if (fileEntity == null)
                {
                    _logger.LogWarning("File with id {Id} not found for download.", fileId);
                    return NotFound();
                }

                if (!AuthorizationHelpers.IsUserAllowedForPatient(User, fileEntity.PatientId))
                {
                    _logger.LogWarning("Unauthorized download attempt for file {Id} (patient {PatientId})", fileId, fileEntity.PatientId);
                    return Forbid();
                }

                var (fileContent, contentType, fileName) = await _fileServices.GetFileContentAsync(fileId);
                _logger.LogInformation("File {FileName} downloaded successfully", fileName);

                return File(fileContent, contentType, fileName);
            }
            catch (FileNotFoundException ex)
            {
                _logger.LogWarning("File not found: {Message}", ex.Message);
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while downloading the file.");
                return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred while downloading the file. {ex.Message}");
            }
        }

        /// Preview/View file by ID (inline display)
        /// axios: axios.get(`/file/preview/${fileId}`)
        /// curl: curl http://localhost:5000/file/preview/1
        [HttpGet("preview/{fileId}")]
        public async Task<IActionResult> PreviewFile(int fileId)
        {
            try
            {
                var fileEntity = await _fileServices.GetFileByIdAsync(fileId);
                if (fileEntity == null)
                {
                    _logger.LogWarning("File with id {Id} not found for preview.", fileId);
                    return NotFound();
                }

                if (!AuthorizationHelpers.IsUserAllowedForPatient(User, fileEntity.PatientId))
                {
                    _logger.LogWarning("Unauthorized preview attempt for file {Id} (patient {PatientId})", fileId, fileEntity.PatientId);
                    return Forbid();
                }

                var (fileContent, contentType, fileName) = await _fileServices.GetFileContentAsync(fileId);
                _logger.LogInformation("File {FileName} previewed successfully", fileName);

                // Return file for inline viewing (not as attachment)
                return File(fileContent, contentType);
            }
            catch (FileNotFoundException ex)
            {
                _logger.LogWarning("File not found for preview: {Message}", ex.Message);
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while previewing the file.");
                return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred while previewing the file. {ex.Message}");
            }
        }

        /// Get file metadata for review
        /// axios: axios.get(`/file/info/${fileId}`)
        /// curl: curl http://localhost:5000/file/info/1
        [HttpGet("info/{fileId}")]
        public async Task<IActionResult> GetFileInfo(int fileId)
        {
            try
            {
                var fileEntity = await _fileServices.GetFileByIdAsync(fileId);
                if (fileEntity == null)
                {
                    _logger.LogWarning("File with id {Id} not found for info.", fileId);
                    return NotFound();
                }

                if (!AuthorizationHelpers.IsUserAllowedForPatient(User, fileEntity.PatientId))
                {
                    _logger.LogWarning("Unauthorized access to file info for file {Id} (patient {PatientId})", fileId, fileEntity.PatientId);
                    return Forbid();
                }

                var fileInfo = new
                {
                    id = fileEntity.Id,
                    fileName = fileEntity.FileName,
                    size = fileEntity.Size,
                    contentType = fileEntity.ContentType,
                    uploadedAt = fileEntity.UploadedAt,
                    patientId = fileEntity.PatientId,
                    sizeFormatted = FormatFileSize(fileEntity.Size),
                    canPreview = CanPreviewFile(fileEntity.ContentType),
                    fileType = GetFileTypeDescription(fileEntity.ContentType)
                };

                _logger.LogInformation("File info retrieved for {FileName}", fileEntity.FileName);
                return Ok(fileInfo);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving file info.");
                return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred while retrieving file info. {ex.Message}");
            }
        }

        private static string FormatFileSize(long bytes)
        {
            string[] sizes = { "B", "KB", "MB", "GB" };
            double len = bytes;
            int order = 0;
            while (len >= 1024 && order < sizes.Length - 1)
            {
                order++;
                len = len / 1024;
            }
            return $"{len:0.##} {sizes[order]}";
        }

        private static bool CanPreviewFile(string? contentType)
        {
            if (string.IsNullOrEmpty(contentType)) return false;

            return contentType.StartsWith("image/") ||
                   contentType == "application/pdf" ||
                   contentType == "text/plain";
        }

        private static string GetFileTypeDescription(string? contentType)
        {
            return contentType switch
            {
                "application/pdf" => "PDF Document",
                "application/msword" => "Word Document",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document" => "Word Document",
                "image/jpeg" => "JPEG Image",
                "image/jpg" => "JPG Image",
                "image/png" => "PNG Image",
                "text/plain" => "Text File",
                _ => "Unknown File Type"
            };
        }
    }
}
