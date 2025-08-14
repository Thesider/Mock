import React, { useState } from 'react';
import './MyAppointments.css';

interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  type: string;
}

const MyAppointments: React.FC = () => {
  const [appointments] = useState<Appointment[]>([
    {
      id: '1',
      doctorName: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      date: '2025-08-20',
      time: '10:00 AM',
      status: 'upcoming',
      type: 'Regular Checkup'
    },
    {
      id: '2',
      doctorName: 'Dr. Michael Chen',
      specialty: 'Dermatology',
      date: '2025-08-15',
      time: '2:30 PM',
      status: 'completed',
      type: 'Consultation'
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');

  const filteredAppointments = appointments.filter(apt => 
    filter === 'all' || apt.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return '#10b981';
      case 'completed':
        return '#6b7280';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="my-appointments">
      <div className="page-header">
        <h1>My Appointments</h1>
        <button className="new-appointment-btn">+ Book New Appointment</button>
      </div>

      <div className="filters">
        {['all', 'upcoming', 'completed', 'cancelled'].map(status => (
          <button
            key={status}
            className={`filter-btn ${filter === status ? 'active' : ''}`}
            onClick={() => setFilter(status as any)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div className="appointments-list">
        {filteredAppointments.length === 0 ? (
          <div className="no-appointments">
            <div className="no-appointments-icon">📅</div>
            <h3>No appointments found</h3>
            <p>You don't have any {filter !== 'all' ? filter : ''} appointments yet.</p>
            <button className="book-appointment-btn">Book Your First Appointment</button>
          </div>
        ) : (
          filteredAppointments.map(appointment => (
            <div key={appointment.id} className="appointment-card">
              <div className="appointment-info">
                <div className="appointment-header">
                  <h3>{appointment.doctorName}</h3>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(appointment.status) }}
                  >
                    {appointment.status}
                  </span>
                </div>
                <p className="specialty">{appointment.specialty}</p>
                <p className="appointment-type">{appointment.type}</p>
                <div className="appointment-datetime">
                  <span className="date">📅 {appointment.date}</span>
                  <span className="time">🕐 {appointment.time}</span>
                </div>
              </div>
              <div className="appointment-actions">
                {appointment.status === 'upcoming' && (
                  <>
                    <button className="action-btn reschedule">Reschedule</button>
                    <button className="action-btn cancel">Cancel</button>
                  </>
                )}
                {appointment.status === 'completed' && (
                  <button className="action-btn view">View Details</button>
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
