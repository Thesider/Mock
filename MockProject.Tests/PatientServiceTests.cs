using MockProject.Modules.Patient;
using Moq;
using FluentAssertions;

namespace MockProject.Tests
{
    public class PatientServiceTests
    {
        private readonly Mock<IPatientRepository> _mockRepository;
        private readonly PatientService _service;

        public PatientServiceTests()
        {
            _mockRepository = new Mock<IPatientRepository>();
            _service = new PatientService(_mockRepository.Object);
        }

        [Fact]
        public async Task AddPatientAsync_ShouldCallRepository()
        {
            // Arrange
            var patient = new PatientEntity
            {
                Name = "Test Patient",
                DateOfBirth = new DateTime(1990, 1, 1),
                Gender = "Male"
            };

            // Act
            await _service.AddPatientAsync(patient);

            // Assert
            _mockRepository.Verify(r => r.AddPatientAsync(patient), Times.Once);
        }

        [Fact]
        public async Task GetPatientByIdAsync_ShouldReturnPatient()
        {
            // Arrange
            var patient = new PatientEntity
            {
                Id = 1,
                Name = "Test Patient",
                DateOfBirth = new DateTime(1990, 1, 1),
                Gender = "Male"
            };
            _mockRepository.Setup(r => r.GetPatientByIdAsync(1))
                .ReturnsAsync(patient);

            // Act
            var result = await _service.GetPatientByIdAsync(1);

            // Assert
            result.Should().NotBeNull();
            result!.Name.Should().Be("Test Patient");
            _mockRepository.Verify(r => r.GetPatientByIdAsync(1), Times.Once);
        }

        [Fact]
        public async Task GetPatientByIdAsync_ShouldReturnNull_WhenNotFound()
        {
            // Arrange
            _mockRepository.Setup(r => r.GetPatientByIdAsync(999))
                .ReturnsAsync((PatientEntity?)null);

            // Act
            var result = await _service.GetPatientByIdAsync(999);

            // Assert
            result.Should().BeNull();
            _mockRepository.Verify(r => r.GetPatientByIdAsync(999), Times.Once);
        }

        [Fact]
        public async Task GetPatientByNameAsync_ShouldReturnPatient()
        {
            // Arrange
            var patient = new PatientEntity
            {
                Id = 1,
                Name = "John Doe",
                DateOfBirth = new DateTime(1990, 1, 1),
                Gender = "Male"
            };
            _mockRepository.Setup(r => r.GetPatientByNameAsync("John Doe"))
                .ReturnsAsync(patient);

            // Act
            var result = await _service.GetPatientByNameAsync("John Doe");

            // Assert
            result.Should().NotBeNull();
            result!.Name.Should().Be("John Doe");
            _mockRepository.Verify(r => r.GetPatientByNameAsync("John Doe"), Times.Once);
        }

        [Fact]
        public async Task GetAllPatientsAsync_ShouldReturnAllPatients()
        {
            // Arrange
            var patients = new List<PatientEntity>
            {
                new PatientEntity { Id = 1, Name = "Patient 1", DateOfBirth = new DateTime(1990, 1, 1), Gender = "Male" },
                new PatientEntity { Id = 2, Name = "Patient 2", DateOfBirth = new DateTime(1992, 2, 2), Gender = "Female" }
            };
            _mockRepository.Setup(r => r.GetAllPatientsAsync())
                .ReturnsAsync(patients);

            // Act
            var result = await _service.GetAllPatientsAsync();

            // Assert
            result.Should().HaveCount(2);
            result.Should().Contain(p => p.Name == "Patient 1");
            result.Should().Contain(p => p.Name == "Patient 2");
            _mockRepository.Verify(r => r.GetAllPatientsAsync(), Times.Once);
        }

        [Fact]
        public async Task UpdatePatientAsync_ShouldCallRepository()
        {
            // Arrange
            var patient = new PatientEntity
            {
                Id = 1,
                Name = "Updated Patient",
                DateOfBirth = new DateTime(1990, 1, 1),
                Gender = "Male"
            };

            // Act
            await _service.UpdatePatientAsync(patient);

            // Assert
            _mockRepository.Verify(r => r.UpdatePatientAsync(patient), Times.Once);
        }

        [Fact]
        public async Task DeletePatientAsync_ShouldCallRepository()
        {
            // Arrange
            var patientId = 1;

            // Act
            await _service.DeletePatientAsync(patientId);

            // Assert
            _mockRepository.Verify(r => r.DeletePatientAsync(patientId), Times.Once);
        }
    }
}
