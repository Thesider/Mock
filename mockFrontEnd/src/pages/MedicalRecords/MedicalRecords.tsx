import React, { useState } from 'react';
import './MedicalRecords.css';

interface MedicalRecord {
  id: string;
  date: string;
  type: string;
  doctor: string;
  diagnosis: string;
  notes: string;
  attachments?: string[];
}

const MedicalRecords: React.FC = () => {
  const [records] = useState<MedicalRecord[]>([
    {
      id: '1',
      date: '2025-08-10',
      type: 'Regular Checkup',
      doctor: 'Dr. Sarah Johnson',
      diagnosis: 'Healthy - No issues found',
      notes: 'Patient in good health. Continue current lifestyle. Next checkup in 6 months.',
      attachments: ['Blood Test Results.pdf', 'X-Ray Images.pdf']
    },
    {
      id: '2',
      date: '2025-07-15',
      type: 'Consultation',
      doctor: 'Dr. Michael Chen',
      diagnosis: 'Minor skin irritation',
      notes: 'Prescribed topical cream. Follow up in 2 weeks if symptoms persist.',
      attachments: ['Prescription.pdf']
    }
  ]);

  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

  return (
    <div className="medical-records">
      <div className="page-header">
        <h1>Medical Records</h1>
        <button className="request-records-btn">Request Records</button>
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
                <div className="record-date">{record.date}</div>
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
                <button className="download-btn">📥 Download</button>
              </div>

              <div className="detail-section">
                <h3>Basic Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Date:</label>
                    <span>{selectedRecord.date}</span>
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
                      <div key={index} className="attachment-item">
                        <span className="attachment-icon">📄</span>
                        <span className="attachment-name">{attachment}</span>
                        <button className="attachment-download">📥</button>
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
