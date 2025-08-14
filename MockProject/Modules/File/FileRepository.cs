using Microsoft.EntityFrameworkCore;
using MockProject.Data;

namespace MockProject.Modules.File
{
    public class FileRepository : IFileRepository
    {
        private readonly MockDbContext _context;

        public FileRepository(MockDbContext context)
        {
            _context = context;
        }

        public async Task AddFileAsync(FileEntity file)
        {
            _context.Files.Add(file);
            await _context.SaveChangesAsync();
        }

        public async Task<FileEntity> GetFileByIdAsync(int id)
        {
            var file = await _context.Files.FindAsync(id);
            if (file == null)
            {
                throw new FileNotFoundException($"File with id {id} not found.");
            }
            return file;
        }

        public async Task<IEnumerable<FileEntity>> GetAllFilesAsync()
        {
            return await _context.Files.ToListAsync();
        }

        public async Task UpdateFileAsync(FileEntity file)
        {
            var existingFile = await _context.Files.FindAsync(file.Id);
            if (existingFile != null)
            {
                _context.Entry(existingFile).CurrentValues.SetValues(file);
                await _context.SaveChangesAsync();
            }
        }

        public async Task DeleteFileAsync(int id)
        {
            var existingFile = await _context.Files.FindAsync(id);
            if (existingFile != null)
            {
                _context.Files.Remove(existingFile);
                await _context.SaveChangesAsync();
            }
            await Task.CompletedTask;
        }
    }
}