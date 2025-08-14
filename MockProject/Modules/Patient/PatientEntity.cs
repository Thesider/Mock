namespace MockProject.Modules.Patient
{
    public class PatientEntity
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public DateTime DateOfBirth { get; set; }
        public required string Gender { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }
        public string? MedicalRecord { get; set; }

    }
}
