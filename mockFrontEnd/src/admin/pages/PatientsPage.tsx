import React, { useState, useEffect } from "react";
import { Card, Table, Alert, Button, Modal, Upload, message, Tooltip } from "antd";
import { UploadOutlined, EyeOutlined, DownloadOutlined, FileSearchOutlined } from "@ant-design/icons";
import { getAllPatients, deletePatient } from "../../api/PatientApi";
import { uploadMedicalFile, getPatientFiles, downloadFile } from "../../api/FileApi";
import type { Patient } from "../../api/PatientApi";
import type { MedicalFile } from "../../api/FileApi";
import FilePreviewModal from "../../components/FilePreviewModal/FilePreviewModal";
import "./PatientsPage.css";

const PatientsPage: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [filesModalVisible, setFilesModalVisible] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientFiles, setPatientFiles] = useState<MedicalFile[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  // Fetch patients data
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAllPatients();
        setPatients(response.data);
      } catch (err: any) {
        setError('Failed to fetch patients');
        console.error('Error fetching patients:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // File upload and management functions
  const handleUploadFile = (patient: Patient) => {
    setSelectedPatient(patient);
    setUploadModalVisible(true);
  };

  const handleViewFiles = async (patient: Patient) => {
    setSelectedPatient(patient);
    try {
      const response = await getPatientFiles(patient.id);
      setPatientFiles(response.data);
      setFilesModalVisible(true);
    } catch (err) {
      message.error('Failed to load patient files');
      console.error('Error loading patient files:', err);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!selectedPatient) return false;

    try {
      setUploading(true);
      await uploadMedicalFile(file, selectedPatient.id);
      message.success(`${file.name} uploaded successfully`);
      setUploadModalVisible(false);
      return true;
    } catch (err: any) {
      message.error(`Failed to upload ${file.name}: ${err.message || 'Unknown error'}`);
      return false;
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadFile = async (file: MedicalFile) => {
    try {
      const response = await downloadFile(file.id);
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      message.success(`Downloaded ${file.fileName}`);
    } catch (err) {
      message.error('Failed to download file');
      console.error('Error downloading file:', err);
    }
  };

  const handleDeletePatient = async (patient: Patient) => {
    console.log("handleDeletePatient called", patient.id);

    // Use simple browser confirm to avoid Ant Design modal issues
    const ok = window.confirm(`Delete patient ${patient.name}? This action cannot be undone.`);
    if (!ok) return;

    try {
      await deletePatient(patient.id);
      setPatients(prev => prev.filter(p => p.id !== patient.id));
      message.success("Patient deleted");
      if (selectedPatient?.id === patient.id) {
        setSelectedPatient(null);
      }
    } catch (err) {
      message.error("Failed to delete patient");
      console.error("Delete error:", err);
    }
  };

  const handlePreviewFile = (file: MedicalFile) => {
    setSelectedFileId(file.id);
    setPreviewModalVisible(true);
  };

  const handleClosePreview = () => {
    setPreviewModalVisible(false);
    setSelectedFileId(null);
  };

  const columns: any[] = [
    { title: "Patient ID", dataIndex: "id", key: "id" },
    { title: "Full Name", dataIndex: "name", key: "name" },
    {
      title: "Date of Birth",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    { title: "Gender", dataIndex: "gender", key: "gender" },
    { title: "Phone", dataIndex: "phoneNumber", key: "phoneNumber" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Medical Record",
      dataIndex: "medicalRecord",
      key: "medicalRecord",
      render: (text: string) => (
        <div className="medical-record-cell">
          {text || 'No records'}
        </div>
      )
    },
    {
      title: "Medical Files",
      key: "files",
      render: (_: any, record: Patient) => (
        <div className="file-actions">
          <Tooltip title="Upload medical file">
            <Button
              type="primary"
              size="small"
              icon={<UploadOutlined />}
              onClick={() => handleUploadFile(record)}
            >
              Upload
            </Button>
          </Tooltip>
          <Tooltip title="View medical files">
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewFiles(record)}
            >
              View Files
            </Button>
          </Tooltip>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Patient) => (
        <div className="actions">
          <Tooltip title="Delete patient">
            <Button danger size="small" onClick={() => { console.log('Delete patient clicked', record.id); handleDeletePatient(record); }}>
              Delete
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  if (error) {
    return (
      <Card title="Patients" bordered={false}>
        <Alert message="Error" description={error} type="error" showIcon />
      </Card>
    );
  }

  return (
    <>
      <Card
        title="Patients"
        bordered={false}
        style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,.09)" }}
      >
        <Table
          columns={columns}
          dataSource={patients}
          rowKey={(record: any) => record.id.toString()}
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Upload Modal */}
      <Modal
        title={`Upload Medical File for ${selectedPatient?.name}`}
        open={uploadModalVisible}
        onCancel={() => setUploadModalVisible(false)}
        footer={null}
      >
        <Upload.Dragger
          name="file"
          multiple={false}
          beforeUpload={handleFileUpload}
          showUploadList={false}
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        >
          <p className="ant-upload-drag-icon">
            <UploadOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">
            Support for medical documents: PDF, DOC, DOCX, JPG, PNG
          </p>
        </Upload.Dragger>
        {uploading && <div className="upload-loading">Uploading...</div>}
      </Modal>

      {/* Files View Modal */}
      <Modal
        title={`Medical Files for ${selectedPatient?.name}`}
        open={filesModalVisible}
        onCancel={() => setFilesModalVisible(false)}
        footer={null}
        width={600}
      >
        {patientFiles.length === 0 ? (
          <div className="empty-files">
            <p>No medical files uploaded yet.</p>
          </div>
        ) : (
          <div className="files-list">
            {patientFiles.map((file) => (
              <div key={file.id} className="file-item">
                <div className="file-info">
                  <span className="file-name">{file.fileName}</span>
                  <span className="file-size">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                  <span className="file-date">
                    {new Date(file.uploadedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="file-actions">
                  <Button
                    size="small"
                    icon={<FileSearchOutlined />}
                    onClick={() => handlePreviewFile(file)}
                  >
                    Preview
                  </Button>
                  <Button
                    size="small"
                    icon={<DownloadOutlined />}
                    onClick={() => handleDownloadFile(file)}
                  >
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* File Preview Modal */}
      <FilePreviewModal
        visible={previewModalVisible}
        fileId={selectedFileId}
        onClose={handleClosePreview}
      />
    </>
  );
};

export default PatientsPage;
