using FluentValidation;
using MockProject.Modules.User;

public class UserValidator : AbstractValidator<UserEntity>
{
    public UserValidator()
    {
        RuleFor(u => u.UserName)
            .NotEmpty().WithMessage("User name is required.")
            .MaximumLength(100).WithMessage("User name cannot exceed 100 characters.");

        RuleFor(u => u.Password)
            .NotEmpty().WithMessage("Password is required.")
            .MinimumLength(6).WithMessage("Password must be at least 6 characters long.");

        RuleFor(u => u.Role)
            .IsInEnum().WithMessage("Invalid user role.");
    }
}