import React, { useState, useEffect } from 'react';
import './BookAppointment.css';
import { getAllDoctors } from '../../api/DoctorApi';
import { addAppointment } from '../../api/AppointmentApi';
import type { Doctor } from '../../api/DoctorApi';
import type { CreateAppointmentRequest } from '../../api/AppointmentApi';

interface TimeSlot {
  time: string;
  available: boolean;
}

const BookAppointment: React.FC = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch doctors from API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAllDoctors();
        setDoctors(response.data);
      } catch (err) {
        setError('Failed to fetch doctors');
        console.error('Error fetching doctors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Get unique specialties from doctors
  const specialties = [...new Set(doctors.map(doctor => doctor.specialty))];

  // Generate time slots (this could also come from an API in the future)
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const times = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
    ];

    times.forEach(time => {
      slots.push({
        time: time,
        available: Math.random() > 0.3 // Random availability for demo
      });
    });

    return slots;
  };

  const timeSlots = generateTimeSlots();

  const filteredDoctors = selectedSpecialty
    ? doctors.filter(doctor => doctor.specialty === selectedSpecialty)
    : doctors;

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      alert('Please select all required fields');
      return;
    }

    try {
      setSubmitting(true);

      // Get user data from localStorage
      let patientId = 1; // Default fallback
      let patientData = {
        id: 1,
        name: "Default Patient",
        dateOfBirth: "1990-01-01T00:00:00",
        gender: "Unknown",
        phoneNumber: "",
        email: "",
        medicalRecord: ""
      };

      const user = localStorage.getItem('user');
      if (user) {
        try {
          const parsed = JSON.parse(user);
          patientId = parsed.id || 1;
          patientData = {
            id: patientId,
            name: parsed.username || "Default Patient",
            dateOfBirth: "1990-01-01T00:00:00", // Default date
            gender: "Unknown",
            phoneNumber: "",
            email: parsed.email || "",
            medicalRecord: ""
          };
        } catch {
          console.warn('Could not parse user data, using default patient data');
        }
      }

      // Convert doctor status to number
      const getStatusNumber = (status: string): number => {
        switch (status) {
          case 'Online': return 0;
          case 'Offline': return 1;
          case 'Busy': return 2;
          default: return 1; // Default to Offline
        }
      };

      // Create appointment request with all required fields
      const appointmentRequest: CreateAppointmentRequest = {
        doctorId: selectedDoctor.id,
        patientId: patientId,
        date: `${selectedDate}T00:00:00`,
        startTime: `${selectedDate}T${selectedTime}:00`,
        endTime: `${selectedDate}T${addMinutes(selectedTime, 30)}:00`,
        description: `Appointment with ${selectedDoctor.name}`,
        location: selectedDoctor.department,
        status: 0, // 0 = Scheduled
        doctor: {
          id: selectedDoctor.id,
          name: selectedDoctor.name,
          specialty: selectedDoctor.specialty,
          department: selectedDoctor.department,
          phoneNumber: selectedDoctor.phoneNumber,
          status: getStatusNumber(selectedDoctor.status)
        },
        patient: patientData
      };

      console.log('Final appointment request:', appointmentRequest);

      await addAppointment(appointmentRequest);
      alert(`Appointment successfully booked with ${selectedDoctor.name} on ${selectedDate} at ${selectedTime}`);

      // Reset form
      setSelectedSpecialty('');
      setSelectedDoctor(null);
      setSelectedDate('');
      setSelectedTime('');

    } catch (err: any) {
      console.error('Error booking appointment:', err);

      let errorMessage = 'Failed to book appointment. Please try again.';
      if (err.response) {
        console.error('Error response:', err.response.data);
        console.error('Error status:', err.response.status);

        // Log detailed validation errors
        if (err.response.data && err.response.data.errors) {
          console.error('Validation errors:', err.response.data.errors);

          // Extract specific error messages
          const errors = err.response.data.errors;
          const errorMessages = [];

          for (const field in errors) {
            if (errors[field] && Array.isArray(errors[field])) {
              errorMessages.push(`${field}: ${errors[field].join(', ')}`);
            }
          }

          if (errorMessages.length > 0) {
            errorMessage = `Validation errors:\n${errorMessages.join('\n')}`;
          }
        }

        if (err.response.status === 409) {
          errorMessage = err.response.data || 'Time slot conflict. Please choose a different time.';
        } else if (err.response.status === 400 && !err.response.data.errors) {
          errorMessage = 'Invalid appointment data. Please check your selections.';
        }
      }

      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Helper function to add minutes to time string
  const addMinutes = (timeStr: string, minutes: number): string => {
    const [hours, mins] = timeStr.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60);
    const newMins = totalMinutes % 60;
    return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="book-appointment">
        <div className="loading">Loading doctors...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="book-appointment">
        <div className="error">
          <p>{error}</p>
          <button type="button" onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

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
              aria-label="Select medical specialty"
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
                      Status: {doctor.status}
                    </div>
                    <div className="next-available">
                      Department: {doctor.department}
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
                aria-label="Select appointment date"
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
                    type="button"
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
              <button
                type="button"
                className="book-btn"
                onClick={handleBookAppointment}
                disabled={submitting}
              >
                {submitting ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookAppointment;
