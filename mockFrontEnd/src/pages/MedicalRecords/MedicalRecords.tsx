import React, { useState, useEffect } from 'react';
import './MedicalRecords.css';
import { getFiles } from '../../api/FileApi';
import { getAppointments } from '../../api/AppointmentApi';
import type { MedicalFile } from '../../api/FileApi';
import type { Appointment } from '../../api/AppointmentApi';

interface MedicalRecord {
  id: string;
  date: string;
  type: string;
  doctor: string;
  diagnosis: string;
  notes: string;
  attachments?: MedicalFile[];
  appointmentId?: number;
}

const MedicalRecords: React.FC = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [files, setFiles] = useState<MedicalFile[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch files and appointments in parallel
        const [filesResponse, appointmentsResponse] = await Promise.all([
          getFiles(),
          getAppointments()
        ]);

        setFiles(filesResponse.data);
        setAppointments(appointmentsResponse.data);

        // Create medical records from completed appointments
        const medicalRecords: MedicalRecord[] = appointmentsResponse.data
          .filter(apt => apt.status === 'Completed')
          .map(apt => ({
            id: apt.id.toString(),
            date: apt.date,
            type: apt.description || 'Medical Appointment',
            doctor: apt.doctor?.name || 'Unknown Doctor',
            diagnosis: 'Completed appointment', // This would come from a medical records API
            notes: `Appointment completed on ${new Date(apt.date).toLocaleDateString()}`,
            attachments: filesResponse.data.filter(file =>
              file.fileName.toLowerCase().includes('medical') ||
              file.fileName.toLowerCase().includes('report')
            ),
            appointmentId: apt.id
          }));

        setRecords(medicalRecords);

      } catch (err) {
        setError('Failed to fetch medical records');
        console.error('Error fetching medical records:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="medical-records">
        <div className="loading">Loading medical records...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="medical-records">
        <div className="error">
          <p>{error}</p>
          <button type="button" onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="medical-records">
      <div className="page-header">
        <h1>Medical Records</h1>
        <button type="button" className="request-records-btn">Request Records</button>
      </div>

      <div className="records-container">
        <div className="records-list">
          {records.map(record => (
            <div
              key={record.id}
              className={`record-card ${selectedRecord?.id === record.id ? 'selected' : ''}`}
              onClick={() => setSelectedRecord(record)}
            >
              <div className="record-header">
                <div className="record-date">{new Date(record.date).toLocaleDateString()}</div>
                <div className="record-type">{record.type}</div>
              </div>
              <div className="record-doctor">👨‍⚕️ {record.doctor}</div>
              <div className="record-diagnosis">{record.diagnosis}</div>
              {record.attachments && record.attachments.length > 0 && (
                <div className="attachment-count">
                  📎 {record.attachments.length} attachment{record.attachments.length > 1 ? 's' : ''}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="record-details">
          {selectedRecord ? (
            <div className="record-detail-content">
              <div className="detail-header">
                <h2>Record Details</h2>
                <button type="button" className="download-btn">📥 Download</button>
              </div>

              <div className="detail-section">
                <h3>Basic Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Date:</label>
                    <span>{new Date(selectedRecord.date).toLocaleDateString()}</span>
                  </div>
                  <div className="info-item">
                    <label>Type:</label>
                    <span>{selectedRecord.type}</span>
                  </div>
                  <div className="info-item">
                    <label>Doctor:</label>
                    <span>{selectedRecord.doctor}</span>
                  </div>
                  <div className="info-item">
                    <label>Diagnosis:</label>
                    <span>{selectedRecord.diagnosis}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Notes</h3>
                <div className="notes-content">
                  {selectedRecord.notes}
                </div>
              </div>

              {selectedRecord.attachments && selectedRecord.attachments.length > 0 && (
                <div className="detail-section">
                  <h3>Attachments</h3>
                  <div className="attachments-list">
                    {selectedRecord.attachments.map((attachment, index) => (
                      <div key={attachment.id || index} className="attachment-item">
                        <span className="attachment-icon">📄</span>
                        <span className="attachment-name">{attachment.fileName}</span>
                        <span className="attachment-size">({(attachment.size / 1024).toFixed(1)} KB)</span>
                        <button type="button" className="attachment-download">📥</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="no-selection">
              <div className="no-selection-icon">📋</div>
              <h3>Select a record to view details</h3>
              <p>Click on any medical record from the list to view its complete information.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalRecords;
