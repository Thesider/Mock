using FluentValidation;

namespace MockProject.Modules.Doctor
{
    public class DoctorValidator : AbstractValidator<DoctorEntity>
    {
        public DoctorValidator()
        {
            RuleFor(d => d.Name)
                .NotEmpty().WithMessage("Name is required.")
                .MaximumLength(100).WithMessage("Name cannot exceed 100 characters.");

            RuleFor(d => d.Specialty)
                .NotEmpty().WithMessage("Specialty is required.")
                .MaximumLength(100).WithMessage("Specialty cannot exceed 100 characters.");

            RuleFor(d => d.Department)
                .NotEmpty().WithMessage("Department is required")
                .MaximumLength(100).WithMessage("Department cannot exceed 100 characters");
        }
    }
}
