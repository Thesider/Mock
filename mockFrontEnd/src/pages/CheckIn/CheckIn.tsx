import React from 'react';
import './CheckIn.css';

const CheckIn: React.FC = () => {
  return (
    <div className="checkin">
      <div className="page-header">
        <h1>Check-in</h1>
      </div>

      <div className="checkin-content">
        <div className="checkin-card">
          <div className="checkin-icon">
            🏥
          </div>
          <h2>Check-in for Your Appointment</h2>
          <p>Use this feature when you arrive at the clinic for your scheduled appointment.</p>
          
          <div className="checkin-form">
            <div className="form-group">
              <label>Appointment ID or Phone Number</label>
              <input 
                type="text" 
                placeholder="Enter appointment ID or phone number"
                className="checkin-input"
              />
            </div>
            
            <button className="checkin-btn">
              Check In
            </button>
          </div>

          <div className="checkin-help">
            <p>Need help? Contact reception at <strong>(555) 123-4567</strong></p>
          </div>
        </div>

        <div className="instructions">
          <h3>Check-in Instructions</h3>
          <ol>
            <li>Arrive at least 15 minutes before your appointment</li>
            <li>Enter your appointment ID or phone number</li>
            <li>Click "Check In" to notify the staff</li>
            <li>Take a seat in the waiting area</li>
            <li>You will be called when the doctor is ready</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default CheckIn;
