using FluentValidation;
using System.IO;
using System.Linq;

namespace MockProject.Modules.File
{
    public class FileValidator : AbstractValidator<FileEntity>
    {
        private static readonly string[] AllowedExtensions = { ".jpg", ".png", ".pdf", ".docx" };
        private const long MaxFileSize = 1000000000;

        public FileValidator()
        {
            RuleFor(f => f.FileName)
                .NotEmpty().WithMessage("File name is required.")
                .MaximumLength(255).WithMessage("File name cannot exceed 255 characters.");

            RuleFor(f => f.FilePath)
                .NotEmpty().WithMessage("File path is required.")
                .MaximumLength(500).WithMessage("File path cannot exceed 500 characters.")
                .Must(path => !path.Contains("..")).WithMessage("Invalid file path.");

            RuleFor(f => f.Size)
                .GreaterThan(0).WithMessage("File size must be greater than 0.")
                .LessThanOrEqualTo(MaxFileSize).WithMessage($"File size cannot exceed {MaxFileSize / 1000000000} GB.");

            RuleFor(f => f.FileName)
                .Must(HaveAllowedExtension)
                .WithMessage(f => $"File extension '{Path.GetExtension(f.FileName)}' is not allowed.");

            RuleFor(f => f.PatientId)
                .GreaterThan(0).WithMessage("Patient ID must be greater than 0.")
                .When(f => f.PatientId.HasValue);
        }

        private bool HaveAllowedExtension(string? fileName)
        {
            if (string.IsNullOrWhiteSpace(fileName))
                return false;

            var ext = Path.GetExtension(fileName).ToLowerInvariant();
            return AllowedExtensions.Contains(ext);
        }
    }
}
