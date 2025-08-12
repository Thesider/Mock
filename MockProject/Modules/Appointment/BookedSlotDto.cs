namespace MockProject.Modules.Appointment
{
    public class BookedSlotDto
    {
        public required string DoctorName { get; set; }
        public required string PatientName { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
    }
}
