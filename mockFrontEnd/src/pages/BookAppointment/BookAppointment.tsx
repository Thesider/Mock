import React, { useState } from 'react';
import './BookAppointment.css';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  nextAvailable: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

const BookAppointment: React.FC = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const specialties = [
    'Cardiology',
    'Dermatology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Psychiatry',
    'General Medicine'
  ];

  const doctors: Doctor[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      rating: 4.8,
      nextAvailable: '2025-08-20'
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      specialty: 'Dermatology',
      rating: 4.9,
      nextAvailable: '2025-08-18'
    },
    {
      id: '3',
      name: 'Dr. Emily Davis',
      specialty: 'Neurology',
      rating: 4.7,
      nextAvailable: '2025-08-22'
    }
  ];

  const timeSlots: TimeSlot[] = [
    { time: '09:00 AM', available: true },
    { time: '09:30 AM', available: true },
    { time: '10:00 AM', available: false },
    { time: '10:30 AM', available: true },
    { time: '11:00 AM', available: true },
    { time: '11:30 AM', available: false },
    { time: '02:00 PM', available: true },
    { time: '02:30 PM', available: true },
    { time: '03:00 PM', available: true },
    { time: '03:30 PM', available: false },
  ];

  const filteredDoctors = selectedSpecialty
    ? doctors.filter(doctor => doctor.specialty === selectedSpecialty)
    : doctors;

  const handleBookAppointment = () => {
    if (selectedDoctor && selectedDate && selectedTime) {
      alert(`Appointment booked with ${selectedDoctor.name} on ${selectedDate} at ${selectedTime}`);
    }
  };

  return (
    <div className="book-appointment">
      <div className="page-header">
        <h1>Book Appointment</h1>
      </div>

      <div className="booking-steps">
        <div className="step">
          <div className="step-number">1</div>
          <div className="step-content">
            <h3>Choose Specialty</h3>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="specialty-select"
            >
              <option value="">All Specialties</option>
              {specialties.map(specialty => (
                <option key={specialty} value={specialty}>{specialty}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="step">
          <div className="step-number">2</div>
          <div className="step-content">
            <h3>Select Doctor</h3>
            <div className="doctors-grid">
              {filteredDoctors.map(doctor => (
                <div
                  key={doctor.id}
                  className={`doctor-card ${selectedDoctor?.id === doctor.id ? 'selected' : ''}`}
                  onClick={() => setSelectedDoctor(doctor)}
                >
                  <div className="doctor-info">
                    <div className="doctor-name">{doctor.name}</div>
                    <div className="doctor-specialty">{doctor.specialty}</div>
                    <div className="doctor-rating">
                      ⭐ {doctor.rating} Rating
                    </div>
                    <div className="next-available">
                      Next available: {doctor.nextAvailable}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {selectedDoctor && (
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Choose Date</h3>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="date-input"
              />
            </div>
          </div>
        )}

        {selectedDate && (
          <div className="step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>Select Time</h3>
              <div className="time-slots">
                {timeSlots.map(slot => (
                  <button
                    key={slot.time}
                    className={`time-slot ${selectedTime === slot.time ? 'selected' : ''} ${!slot.available ? 'unavailable' : ''}`}
                    onClick={() => slot.available && setSelectedTime(slot.time)}
                    disabled={!slot.available}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedDoctor && selectedDate && selectedTime && (
          <div className="booking-summary">
            <div className="summary-content">
              <h3>Appointment Summary</h3>
              <div className="summary-item">
                <span>Doctor:</span>
                <span>{selectedDoctor.name}</span>
              </div>
              <div className="summary-item">
                <span>Specialty:</span>
                <span>{selectedDoctor.specialty}</span>
              </div>
              <div className="summary-item">
                <span>Date:</span>
                <span>{selectedDate}</span>
              </div>
              <div className="summary-item">
                <span>Time:</span>
                <span>{selectedTime}</span>
              </div>
              <button className="book-btn" onClick={handleBookAppointment}>
                Confirm Booking
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookAppointment;
