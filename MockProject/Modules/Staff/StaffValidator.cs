using FluentValidation;

namespace MockProject.Modules.Staff
{
    public class StaffValidator : AbstractValidator<StaffEntity>
    {
        public StaffValidator()
        {
            RuleFor(s => s.Name).NotEmpty().WithMessage("Name is required.");
            RuleFor(s => s.Email).EmailAddress().When(s => !string.IsNullOrEmpty(s.Email));
        }
    }
}
