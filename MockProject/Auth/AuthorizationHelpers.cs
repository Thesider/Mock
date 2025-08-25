using System.Security.Claims;

namespace MockProject.Auth
{
    public static class AuthorizationHelpers
    {

        public static bool IsUserAllowedForPatient(ClaimsPrincipal? user, int? patientId)
        {
            if (user == null) return false;
            if (user.IsInRole("Admin") || user.IsInRole("Doctor")) return true;

            // If no patientId provided by the caller, deny for normal users
            if (!patientId.HasValue) return false;

            var patientClaim = user.FindFirst("patientId")?.Value;
            if (int.TryParse(patientClaim, out var pid))
            {
                return pid == patientId.Value;
            }

            return false;
        }
    }
}
