import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyAppointments.css';
import { getAppointments } from "../../api/AppointmentApi"
import type { Appointment } from "../../api/AppointmentApi"

const MyAppointments: React.FC = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'Scheduled' | 'Completed' | 'Canceled'>('all');

  // Fetch appointments from API
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAppointments();
        setAppointments(response.data);
      } catch (err) {
        setError('Failed to fetch appointments');
        console.error('Error fetching appointments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter(apt =>
    filter === 'all' || apt.status === filter
  );



  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="my-appointments">
        <div className="loading">Loading appointments...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-appointments">
        <div className="error">
          <p>{error}</p>
          <button type="button" onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-appointments">
      <div className="page-header">
        <h1>My Appointments</h1>
        <button type="button" className="new-appointment-btn" onClick={() => navigate("/book-appointment")}>+ Book New Appointment</button>
      </div>

      <div className="filters">
        {(['all', 'Scheduled', 'Completed', 'Canceled'] as const).map(status => (
          <button
            type="button"
            key={status}
            className={`filter-btn ${filter === status ? 'active' : ''}`}
            onClick={() => setFilter(status)}
          >
            {status === 'all' ? 'All' : status}
          </button>
        ))}
      </div>

      <div className="appointments-list">
        {filteredAppointments.length === 0 ? (
          <div className="no-appointments">
            <div className="no-appointments-icon">📅</div>
            <h3>No appointments found</h3>
            <p>You don't have any {filter !== 'all' ? filter : ''} appointments yet.</p>
            <button type="button" className="book-appointment-btn" onClick={() => navigate("/book-appointment")}>Book Your First Appointment</button>
          </div>
        ) : (
          filteredAppointments.map(appointment => (
            <div key={appointment.id} className="appointment-card">
              <div className="appointment-info">
                <div className="appointment-header">
                  <h3>{appointment.doctor?.name || 'Unknown Doctor'}</h3>
                  <span
                    className={`status-badge status-${appointment.status.toLowerCase()}`}
                  >
                    {appointment.status}
                  </span>
                </div>
                <p className="specialty">{appointment.doctor?.specialty || 'General'}</p>
                <p className="appointment-type">{appointment.description || 'Appointment'}</p>
                <div className="appointment-datetime">
                  <span className="date">📅 {formatDate(appointment.date)}</span>
                  <span className="time">🕐 {formatTime(appointment.startTime)}</span>
                </div>
                {appointment.location && (
                  <p className="location">📍 {appointment.location}</p>
                )}
              </div>
              <div className="appointment-actions">
                {appointment.status === 'Scheduled' && (
                  <>
                    <button type="button" className="action-btn reschedule">Reschedule</button>
                    <button type="button" className="action-btn cancel">Cancel</button>
                  </>
                )}
                {appointment.status === 'Completed' && (
                  <button type="button" className="action-btn view">View Details</button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyAppointments;
