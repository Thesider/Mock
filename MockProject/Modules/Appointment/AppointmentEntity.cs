using MockProject.Modules.Doctor;
using MockProject.Modules.Patient;

namespace MockProject.Modules.Appointment
{
    public class AppointmentEntity
    {
        public int Id { get; set; }

        public DateTime Date { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string? Description { get; set; }
        public string? Location { get; set; }
        public AppointmentStatus Status { get; set; }

        public int DoctorId { get; set; }
        public int PatientId { get; set; }

        public required DoctorEntity Doctor { get; set; }
        public required PatientEntity Patient { get; set; }
    }

    public enum AppointmentStatus
    {
        Scheduled,
        Completed,
        Canceled
    }
}