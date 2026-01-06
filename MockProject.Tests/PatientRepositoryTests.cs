using Microsoft.EntityFrameworkCore;
using MockProject.Data;
using MockProject.Modules.Patient;
using FluentAssertions;

namespace MockProject.Tests
{
    public class PatientRepositoryTests : IDisposable
    {
        private readonly MockDbContext _context;
        private readonly PatientRepository _repository;

        public PatientRepositoryTests()
        {
            var options = new DbContextOptionsBuilder<MockDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new MockDbContext(options);
            _repository = new PatientRepository(_context);
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }

        [Fact]
        public async Task AddPatientAsync_ShouldAddPatient()
        {
            // Arrange
            var patient = new PatientEntity
            {
                Name = "John Doe",
                DateOfBirth = new DateTime(1990, 1, 1),
                Gender = "Male",
                PhoneNumber = "1234567890",
                Email = "john.doe@example.com"
            };

            // Act
            await _repository.AddPatientAsync(patient);

            // Assert
            var result = await _context.Patients.FindAsync(patient.Id);
            result.Should().NotBeNull();
            result!.Name.Should().Be("John Doe");
            result.Email.Should().Be("john.doe@example.com");
        }

        [Fact]
        public async Task GetPatientByIdAsync_ShouldReturnPatient_WhenExists()
        {
            // Arrange
            var patient = new PatientEntity
            {
                Name = "Jane Doe",
                DateOfBirth = new DateTime(1995, 5, 15),
                Gender = "Female",
                PhoneNumber = "0987654321"
            };
            _context.Patients.Add(patient);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetPatientByIdAsync(patient.Id);

            // Assert
            result.Should().NotBeNull();
            result!.Name.Should().Be("Jane Doe");
            result.Gender.Should().Be("Female");
        }

        [Fact]
        public async Task GetPatientByIdAsync_ShouldReturnNull_WhenNotExists()
        {
            // Act
            var result = await _repository.GetPatientByIdAsync(999);

            // Assert
            result.Should().BeNull();
        }

        [Fact]
        public async Task GetPatientByNameAsync_ShouldReturnPatient_WhenExists()
        {
            // Arrange
            var patient = new PatientEntity
            {
                Name = "Alice Smith",
                DateOfBirth = new DateTime(1988, 3, 20),
                Gender = "Female"
            };
            _context.Patients.Add(patient);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetPatientByNameAsync("Alice Smith");

            // Assert
            result.Should().NotBeNull();
            result!.Name.Should().Be("Alice Smith");
        }

        [Fact]
        public async Task GetPatientByNameAsync_ShouldReturnNull_WhenNotExists()
        {
            // Act
            var result = await _repository.GetPatientByNameAsync("NonExistent");

            // Assert
            result.Should().BeNull();
        }

        [Fact]
        public async Task GetAllPatientsAsync_ShouldReturnAllPatients()
        {
            // Arrange
            var patients = new[]
            {
                new PatientEntity { Name = "Patient 1", DateOfBirth = new DateTime(1990, 1, 1), Gender = "Male" },
                new PatientEntity { Name = "Patient 2", DateOfBirth = new DateTime(1992, 2, 2), Gender = "Female" },
                new PatientEntity { Name = "Patient 3", DateOfBirth = new DateTime(1994, 3, 3), Gender = "Male" }
            };
            _context.Patients.AddRange(patients);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetAllPatientsAsync();

            // Assert
            result.Should().HaveCount(3);
            result.Should().Contain(p => p.Name == "Patient 1");
            result.Should().Contain(p => p.Name == "Patient 2");
            result.Should().Contain(p => p.Name == "Patient 3");
        }

        [Fact]
        public async Task GetAllPatientsAsync_ShouldReturnEmpty_WhenNoPatients()
        {
            // Act
            var result = await _repository.GetAllPatientsAsync();

            // Assert
            result.Should().BeEmpty();
        }

        [Fact]
        public async Task UpdatePatientAsync_ShouldUpdatePatient_WhenExists()
        {
            // Arrange
            var patient = new PatientEntity
            {
                Name = "Bob Johnson",
                DateOfBirth = new DateTime(1985, 7, 10),
                Gender = "Male",
                Email = "bob@example.com"
            };
            _context.Patients.Add(patient);
            await _context.SaveChangesAsync();

            // Act
            patient.Email = "bob.johnson@example.com";
            patient.PhoneNumber = "5555555555";
            await _repository.UpdatePatientAsync(patient);

            // Assert
            var result = await _context.Patients.FindAsync(patient.Id);
            result.Should().NotBeNull();
            result!.Email.Should().Be("bob.johnson@example.com");
            result.PhoneNumber.Should().Be("5555555555");
        }

        [Fact]
        public async Task UpdatePatientAsync_ShouldDoNothing_WhenNotExists()
        {
            // Arrange
            var patient = new PatientEntity
            {
                Id = 999,
                Name = "NonExistent",
                DateOfBirth = new DateTime(1990, 1, 1),
                Gender = "Male"
            };

            // Act & Assert - Should not throw
            await _repository.UpdatePatientAsync(patient);
        }

        [Fact]
        public async Task DeletePatientAsync_ShouldRemovePatient_WhenExists()
        {
            // Arrange
            var patient = new PatientEntity
            {
                Name = "Charlie Brown",
                DateOfBirth = new DateTime(1980, 12, 25),
                Gender = "Male"
            };
            _context.Patients.Add(patient);
            await _context.SaveChangesAsync();
            var patientId = patient.Id;

            // Act
            await _repository.DeletePatientAsync(patientId);

            // Assert
            var result = await _context.Patients.FindAsync(patientId);
            result.Should().BeNull();
        }

        [Fact]
        public async Task DeletePatientAsync_ShouldDoNothing_WhenNotExists()
        {
            // Act & Assert - Should not throw
            await _repository.DeletePatientAsync(999);
        }
    }
}
