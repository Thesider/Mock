import React, { useState, useEffect } from 'react';
import { Modal, Button, Spin, Alert, Descriptions, Tag } from 'antd';
import { DownloadOutlined, EyeOutlined, FileTextOutlined } from '@ant-design/icons';
import { getFileInfo, previewFile, downloadFile } from '../../api/FileApi';
import type { MedicalFile } from '../../api/FileApi';
import './FilePreviewModal.css';

interface FilePreviewModalProps {
  visible: boolean;
  fileId: number | null;
  onClose: () => void;
}

interface FileInfo {
  id: number;
  fileName: string;
  size: number;
  contentType: string;
  uploadedAt: string;
  patientId: number;
  sizeFormatted: string;
  canPreview: boolean;
  fileType: string;
}

const FilePreviewModal: React.FC<FilePreviewModalProps> = ({ visible, fileId, onClose }) => {
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (visible && fileId) {
      loadFileInfo();
    } else {
      // Clean up when modal closes
      setFileInfo(null);
      setPreviewUrl(null);
      setError(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    }
  }, [visible, fileId]);

  const loadFileInfo = async () => {
    if (!fileId) return;

    try {
      setLoading(true);
      setError(null);

      // Get file information
      const info = await getFileInfo(fileId);
      setFileInfo(info);

      // Load preview if supported
      if (info.canPreview) {
        const previewResponse = await previewFile(fileId);
        const url = URL.createObjectURL(previewResponse.data);
        setPreviewUrl(url);
      }
    } catch (err: any) {
      setError('Failed to load file information');
      console.error('Error loading file info:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!fileId || !fileInfo) return;

    try {
      setDownloading(true);
      const response = await downloadFile(fileId);
      const url = URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileInfo.fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading file:', err);
    } finally {
      setDownloading(false);
    }
  };

  const renderPreview = () => {
    if (!fileInfo || !previewUrl) return null;

    const { contentType } = fileInfo;

    if (contentType.startsWith('image/')) {
      return (
        <div className="file-preview-container">
          <img 
            src={previewUrl} 
            alt={fileInfo.fileName}
            className="preview-image"
          />
        </div>
      );
    }

    if (contentType === 'application/pdf') {
      return (
        <div className="file-preview-container">
          <iframe
            src={previewUrl}
            className="preview-pdf"
            title={fileInfo.fileName}
          />
        </div>
      );
    }

    if (contentType === 'text/plain') {
      return (
        <div className="file-preview-container">
          <iframe
            src={previewUrl}
            className="preview-text"
            title={fileInfo.fileName}
          />
        </div>
      );
    }

    return null;
  };

  const getFileIcon = (contentType: string) => {
    if (contentType.startsWith('image/')) return '🖼️';
    if (contentType === 'application/pdf') return '📄';
    if (contentType.includes('word')) return '📝';
    return '📁';
  };

  return (
    <Modal
      title={
        <div className="modal-title">
          <EyeOutlined /> File Review
        </div>
      }
      open={visible}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
        <Button
          key="download"
          type="primary"
          icon={<DownloadOutlined />}
          loading={downloading}
          onClick={handleDownload}
          disabled={!fileInfo}
        >
          Download
        </Button>,
      ]}
    >
      {loading && (
        <div className="loading-container">
          <Spin size="large" />
          <p>Loading file information...</p>
        </div>
      )}

      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {fileInfo && (
        <>
          {/* File Information */}
          <Descriptions
            title="File Information"
            bordered
            size="small"
            column={2}
            style={{ marginBottom: 16 }}
          >
            <Descriptions.Item label="File Name" span={2}>
              <span className="file-name">
                {getFileIcon(fileInfo.contentType)} {fileInfo.fileName}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="File Type">
              <Tag color="blue">{fileInfo.fileType}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="File Size">
              {fileInfo.sizeFormatted}
            </Descriptions.Item>
            <Descriptions.Item label="Upload Date">
              {new Date(fileInfo.uploadedAt).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Patient ID">
              {fileInfo.patientId}
            </Descriptions.Item>
          </Descriptions>

          {/* File Preview */}
          {fileInfo.canPreview ? (
            <>
              <h4>Preview:</h4>
              {renderPreview()}
            </>
          ) : (
            <div className="no-preview">
              <FileTextOutlined style={{ fontSize: 48, color: '#ccc' }} />
              <p>Preview not available for this file type</p>
              <p>Click Download to view the file</p>
            </div>
          )}
        </>
      )}
    </Modal>
  );
};

export default FilePreviewModal;
