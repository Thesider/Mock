using Microsoft.AspNetCore.Http;

namespace MockProject.Modules.File
{
    public class FileService : IFileServices
    {
        private readonly IFileRepository _fileRepository;
        private readonly IWebHostEnvironment _environment;

        public FileService(IFileRepository fileRepository, IWebHostEnvironment environment)
        {
            _fileRepository = fileRepository;
            _environment = environment;
        }

        public async Task AddFileAsync(FileEntity file)
        {
            await _fileRepository.AddFileAsync(file);
        }

        public async Task<FileEntity> GetFileByIdAsync(int id)
        {
            return await _fileRepository.GetFileByIdAsync(id);
        }

        public async Task<IEnumerable<FileEntity>> GetAllFilesAsync()
        {
            return await _fileRepository.GetAllFilesAsync();
        }

        public async Task<IEnumerable<FileEntity>> GetFilesByPatientIdAsync(int patientId)
        {
            return await _fileRepository.GetFilesByPatientIdAsync(patientId);
        }

        public async Task UpdateFileAsync(FileEntity file)
        {
            await _fileRepository.UpdateFileAsync(file);
        }

        public async Task DeleteFileAsync(int id)
        {
            // Get file info before deleting to remove physical file
            var fileEntity = await _fileRepository.GetFileByIdAsync(id);
            if (fileEntity != null && System.IO.File.Exists(fileEntity.FilePath))
            {
                System.IO.File.Delete(fileEntity.FilePath);
            }
            await _fileRepository.DeleteFileAsync(id);
        }

        public async Task<FileEntity> SaveFileAsync(IFormFile file, int patientId)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("File is empty or null");

            // Create uploads directory if it doesn't exist
            var uploadsPath = Path.Combine(_environment.ContentRootPath, "uploads", "patients", patientId.ToString());
            Directory.CreateDirectory(uploadsPath);

            // Generate unique filename to avoid conflicts
            var fileName = $"{Guid.NewGuid()}_{file.FileName}";
            var filePath = Path.Combine(uploadsPath, fileName);

            // Save file to disk
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Create file entity
            var fileEntity = new FileEntity
            {
                FileName = file.FileName,
                FilePath = filePath,
                Size = file.Length,
                UploadedAt = DateTime.UtcNow,
                PatientId = patientId,
                ContentType = file.ContentType
            };

            // Save to database
            await _fileRepository.AddFileAsync(fileEntity);
            return fileEntity;
        }

        public async Task<(byte[] fileContent, string contentType, string fileName)> GetFileContentAsync(int fileId)
        {
            var fileEntity = await _fileRepository.GetFileByIdAsync(fileId);
            if (fileEntity == null)
                throw new FileNotFoundException($"File with id {fileId} not found");

            if (!System.IO.File.Exists(fileEntity.FilePath))
                throw new FileNotFoundException($"Physical file not found: {fileEntity.FilePath}");

            var fileContent = await System.IO.File.ReadAllBytesAsync(fileEntity.FilePath);
            return (fileContent, fileEntity.ContentType ?? "application/octet-stream", fileEntity.FileName);
        }
    }
}
