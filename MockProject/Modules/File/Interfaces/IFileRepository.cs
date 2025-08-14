namespace MockProject.Modules.File
{
    public interface IFileRepository
    {
        Task AddFileAsync(FileEntity file);
        Task<FileEntity> GetFileByIdAsync(int id);
        Task<IEnumerable<FileEntity>> GetAllFilesAsync();
        Task UpdateFileAsync(FileEntity file);
        Task DeleteFileAsync(int id);
    }
}