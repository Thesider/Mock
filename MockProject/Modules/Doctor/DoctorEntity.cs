namespace MockProject.Modules.Doctor
{
    public class DoctorEntity
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Specialty { get; set; }
        public required string Department { get; set; }
        public int PhoneNumber { get; set; }
        public Status Status { get; set; }

    }

    public enum Status
    {
        Online,
        Offline,
        Busy
    }
}