import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./BookAppointment.css";
import { getAllDoctors } from "../../api/DoctorApi";
import { addAppointment } from "../../api/AppointmentApi";
import type { Doctor } from "../../api/DoctorApi";
import type { CreateAppointmentRequest } from "../../api/AppointmentApi";



interface TimeSlot {
  time: string;
  available: boolean;
}

const BookAppointment: React.FC = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAllDoctors();
        setDoctors(response.data);
      } catch (err) {
        setError("Failed to fetch doctors");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const specialties = [...new Set(doctors.map((doctor) => doctor.specialty))];

  // Demo time slots (replace with API call if available)
  const generateTimeSlots = (): TimeSlot[] => {
    const times = [
      "09:00",
      "09:30",
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "14:00",
      "14:30",
      "15:00",
      "15:30",
      "16:00",
      "16:30",
    ];
    return times.map((time) => ({ time, available: true }));
  };
  const timeSlots = generateTimeSlots();

  const filteredDoctors = selectedSpecialty
    ? doctors.filter((doctor) => doctor.specialty === selectedSpecialty)
    : doctors;

  // Helper: add minutes to time string
  const addMinutes = (timeStr: string, minutes: number): string => {
    const [hours, mins] = timeStr.split(":").map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60);
    const newMins = totalMinutes % 60;
    return `${newHours.toString().padStart(2, "0")}:${newMins
      .toString()
      .padStart(2, "0")}`;
  };

  // Helper: map doctor status string to number
  const getStatusNumber = (status: string): number => {
    switch (status) {
      case "Online":
        return 0;
      case "Offline":
        return 1;
      case "Busy":
        return 2;
      default:
        return 1;
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      alert("Please select all required fields");
      return;
    }
    setSubmitting(true);

    const getCurrentPatientId = (): number => {
      // Prefer patientId from JWT token claim (most authoritative)
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const parts = token.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            if (payload?.patientId) {
              const n = Number(payload.patientId);
              if (!isNaN(n) && n > 0) return n;
            }
          }
        } catch (e) {
          /* ignore token parse errors */
        }
      }

      // Try explicit patientId key
      const pid = localStorage.getItem("patientId");
      if (pid) {
        const n = Number(pid);
        if (!isNaN(n) && n > 0) return n;
      }

      // Try stored user object
      const userStorage = localStorage.getItem("user");
      if (userStorage) {
        try {
          const parsed = JSON.parse(userStorage);
          if (parsed?.patientId) {
            const n = Number(parsed.patientId);
            if (!isNaN(n) && n > 0) return n;
          }
        } catch (e) {
          /* ignore */
        }
      }

      // Try stored patient object
      const patientStorage = localStorage.getItem("patient");
      if (patientStorage) {
        try {
          const parsedP = JSON.parse(patientStorage);
          if (parsedP?.id) {
            const n = Number(parsedP.id);
            if (!isNaN(n) && n > 0) return n;
          }
        } catch (e) {
          /* ignore */
        }
      }

      return 0;
    };

    const currentPatientId = getCurrentPatientId();

    const appointmentRequest: CreateAppointmentRequest = {
      id: 0,
      patientId: currentPatientId,
      date: `${selectedDate}T00:00:00`,
      startTime: `${selectedDate}T${selectedTime}:00`,
      endTime: `${selectedDate}T${addMinutes(selectedTime, 30)}:00`,
      description: `Appointment with ${selectedDoctor.name}`,
      location: selectedDoctor.department,
      status: 0,
      doctorId: selectedDoctor.id,
    };

    try {
      await addAppointment(appointmentRequest);
      alert(
        `Appointment successfully booked with ${selectedDoctor.name} on ${selectedDate} at ${selectedTime}`
      );
      setSelectedSpecialty("");
      setSelectedDoctor(null);
      setSelectedDate("");
      setSelectedTime("");
    } catch (err: any) {
      let errorMessage = "Failed to book appointment. Please try again.";
      if (err.response) {
        if (err.response.status === 409) {
          errorMessage =
            err.response.data ||
            "Time slot conflict. Please choose a different time.";
        } else if (err.response.status === 400 && err.response.data.errors) {
          const errors = err.response.data.errors;
          errorMessage = Object.keys(errors)
            .map((field) => `${field}: ${errors[field].join(", ")}`)
            .join("\n");
        }
      }
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="book-appointment">
          <div className="loading">Loading doctors...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="book-appointment">
          <div className="error">
            <p>{error}</p>
            <button type="button" onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="book-appointment">
        <div className="page-header">
          <h1>Book Appointment</h1>
          <p className="page-description">
            Easily schedule your medical appointments online. Select a
            specialty, choose a doctor, pick your date and time, and confirm
            your booking in just a few steps.
          </p>
        </div>

        <div className="booking-steps">
          {/* Step 1: Specialty */}
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
                {specialties.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Step 2: Doctor */}
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Select Doctor</h3>
              <div className="doctors-grid">
                {filteredDoctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className={`doctor-card ${selectedDoctor?.id === doctor.id ? "selected" : ""
                      }`}
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
          {/* Step 3: Date */}
          {selectedDoctor && (
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Choose Date</h3>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="date-input"
                  aria-label="Select appointment date"
                />
              </div>
            </div>
          )}
          {/* Step 4: Time */}
          {selectedDate && (
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Select Time</h3>
                <div className="time-slots">
                  {timeSlots.map((slot) => (
                    <button
                      type="button"
                      key={slot.time}
                      className={`time-slot ${selectedTime === slot.time ? "selected" : ""
                        } ${!slot.available ? "unavailable" : ""}`}
                      onClick={() =>
                        slot.available && setSelectedTime(slot.time)
                      }
                      disabled={!slot.available}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* Summary & Book */}
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
                  {submitting ? "Booking..." : "Confirm Booking"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BookAppointment;
