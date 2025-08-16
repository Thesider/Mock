namespace MockProject.Modules.File
{
    public class FileEntity
    {
        public int Id { get; set; }
        public required string FileName { get; set; }
        public required string FilePath { get; set; }
        public long Size { get; set; }
        public DateTime UploadedAt { get; set; }
        public int? PatientId { get; set; }
        public string? ContentType { get; set; }
    }
}