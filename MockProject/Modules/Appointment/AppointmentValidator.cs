using FluentValidation;
using MockProject.Modules.Appointment;

public class AppointmentValidator : AbstractValidator<AppointmentEntity>
{
    public AppointmentValidator()
    {
        RuleFor(appointment => appointment.Date)
            .GreaterThan(DateTime.Now)
            .WithMessage("Appointment date must be in the future.");

        RuleFor(appointment => appointment.EndTime)
            .GreaterThan(appointment => appointment.StartTime)
            .WithMessage("Appointment end time must be after start time.");

    }
}
