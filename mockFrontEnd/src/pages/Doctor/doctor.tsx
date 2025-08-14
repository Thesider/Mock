import React, { useState } from 'react';
import './doctor.modules.css';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  avatar: string;
  availability: string[];
  bio: string;
  education: string[];
  languages: string[];
}

const Doctor: React.FC = () => {
  const [doctors] = useState<Doctor[]>([
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiologist',
      experience: '15 years',
      rating: 4.9,
      avatar: 'https://i.pravatar.cc/150?img=1',
      availability: ['Monday', 'Wednesday', 'Friday'],
      bio: 'Experienced cardiologist specializing in heart disease prevention and treatment.',
      education: ['Harvard Medical School', 'Johns Hopkins Residency'],
      languages: ['English', 'Spanish']
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      specialty: 'Dermatologist',
      experience: '12 years',
      rating: 4.8,
      avatar: 'https://i.pravatar.cc/150?img=2',
      availability: ['Tuesday', 'Thursday', 'Saturday'],
      bio: 'Skin specialist with expertise in cosmetic and medical dermatology.',
      education: ['Stanford Medical School', 'UCSF Dermatology Residency'],
      languages: ['English', 'Mandarin']
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      specialty: 'Pediatrician',
      experience: '10 years',
      rating: 4.7,
      avatar: 'https://i.pravatar.cc/150?img=3',
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      bio: 'Dedicated pediatrician focused on child healthcare and development.',
      education: ['UCLA Medical School', 'Children\'s Hospital Residency'],
      languages: ['English', 'Spanish', 'Portuguese']
    }
  ]);

  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  return (
    <div className="doctors-page">
      <div className="page-header">
        <h1>Our Doctors</h1>
        <div className="search-filter">
          <input 
            type="text" 
            placeholder="Search doctors..." 
            className="search-input"
          />
          <select className="specialty-filter">
            <option value="">All Specialties</option>
            <option value="cardiologist">Cardiologist</option>
            <option value="dermatologist">Dermatologist</option>
            <option value="pediatrician">Pediatrician</option>
          </select>
        </div>
      </div>

      <div className="doctors-container">
        <div className="doctors-grid">
          {doctors.map(doctor => (
            <div 
              key={doctor.id} 
              className="doctor-card"
              onClick={() => setSelectedDoctor(doctor)}
            >
              <div className="doctor-avatar">
                <img src={doctor.avatar} alt={doctor.name} />
              </div>
              <div className="doctor-info">
                <h3 className="doctor-name">{doctor.name}</h3>
                <p className="doctor-specialty">{doctor.specialty}</p>
                <div className="doctor-rating">
                  <span className="rating-stars">⭐ {doctor.rating}</span>
                  <span className="experience">{doctor.experience} experience</span>
                </div>
                <div className="availability">
                  Available: {doctor.availability.join(', ')}
                </div>
                <button className="book-appointment-btn">
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedDoctor && (
          <div className="doctor-modal">
            <div className="modal-content">
              <div className="modal-header">
                <h2>{selectedDoctor.name}</h2>
                <button 
                  className="close-modal"
                  onClick={() => setSelectedDoctor(null)}
                >
                  ✕
                </button>
              </div>
              
              <div className="modal-body">
                <div className="doctor-profile">
                  <img src={selectedDoctor.avatar} alt={selectedDoctor.name} />
                  <div className="profile-info">
                    <h3>{selectedDoctor.specialty}</h3>
                    <p className="rating">⭐ {selectedDoctor.rating} rating</p>
                    <p className="experience">{selectedDoctor.experience} experience</p>
                  </div>
                </div>

                <div className="doctor-details">
                  <div className="detail-section">
                    <h4>Biography</h4>
                    <p>{selectedDoctor.bio}</p>
                  </div>

                  <div className="detail-section">
                    <h4>Education</h4>
                    <ul>
                      {selectedDoctor.education.map((edu, index) => (
                        <li key={index}>{edu}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="detail-section">
                    <h4>Languages</h4>
                    <p>{selectedDoctor.languages.join(', ')}</p>
                  </div>

                  <div className="detail-section">
                    <h4>Availability</h4>
                    <div className="availability-days">
                      {selectedDoctor.availability.map((day, index) => (
                        <span key={index} className="availability-day">{day}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="modal-actions">
                  <button className="book-appointment-btn primary">
                    Book Appointment
                  </button>
                  <button className="contact-btn">
                    Contact Doctor
                  </button>
                </div>
              </div>
            </div>
            <div className="modal-overlay" onClick={() => setSelectedDoctor(null)}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctor;