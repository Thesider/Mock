namespace MockProject.Modules.Staff
{
    public class StaffEntity
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
    }
}
