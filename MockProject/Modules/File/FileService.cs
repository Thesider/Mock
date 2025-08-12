namespace MockProject.Modules.File
{
    public class FileService : IFileServices
    {
        private readonly IFileRepository _fileRepository;

        public FileService(IFileRepository fileRepository)
        {
            _fileRepository = fileRepository;
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

        public async Task UpdateFileAsync(FileEntity file)
        {
            await _fileRepository.UpdateFileAsync(file);
        }

        public async Task DeleteFileAsync(int id)
        {
            await _fileRepository.DeleteFileAsync(id);
        }
    }
}
