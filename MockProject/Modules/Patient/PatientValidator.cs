using FluentValidation;
using MockProject.Modules.Patient;

public class PatientValidator : AbstractValidator<PatientEntity>
{
    public PatientValidator()
    {
        RuleFor(patient => patient.Name)
            .NotEmpty()
            .WithMessage("Name is required.");

        RuleFor(patient => patient.DateOfBirth)
            .NotEmpty()
            .WithMessage("Date of Birth is required.");

    }
}