namespace MockProject.Modules.File
{
    public interface IFileServices
    {
        Task AddFileAsync(FileEntity file);
        Task<FileEntity> GetFileByIdAsync(int id);
        Task<IEnumerable<FileEntity>> GetAllFilesAsync();
        Task<IEnumerable<FileEntity>> GetFilesByPatientIdAsync(int patientId);
        Task UpdateFileAsync(FileEntity file);
        Task DeleteFileAsync(int id);
        Task<FileEntity> SaveFileAsync(IFormFile file, int patientId);
        Task<(byte[] fileContent, string contentType, string fileName)> GetFileContentAsync(int fileId);
    }
}
