using Microsoft.EntityFrameworkCore;
using MockProject.Modules.User;
using MockProject.Modules.File;
using MockProject.Modules.Doctor;
using MockProject.Modules.Appointment;
using MockProject.Modules.Patient;
using MockProject.Modules.Staff;

namespace MockProject.Data
{
    public class MockDbContext : DbContext
    {
        public MockDbContext(DbContextOptions<MockDbContext> options) : base(options) { }

        public DbSet<UserEntity> Users { get; set; }
        public DbSet<FileEntity> Files { get; set; }
        public DbSet<DoctorEntity> Doctors { get; set; }
        public DbSet<PatientEntity> Patients { get; set; }
        public DbSet<AppointmentEntity> Appointments { get; set; }
        public DbSet<StaffEntity> Staff { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserEntity>().HasKey(u => u.Id);
            modelBuilder.Entity<FileEntity>().HasKey(f => f.Id);
            modelBuilder.Entity<DoctorEntity>().HasKey(d => d.Id);
            modelBuilder.Entity<StaffEntity>().HasKey(s => s.Id);
            modelBuilder.Entity<AppointmentEntity>().HasKey(a => a.Id);
        }
    }
}