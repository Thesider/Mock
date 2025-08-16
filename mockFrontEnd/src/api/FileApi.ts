import AxiosClient from "./AxiosClient";

export interface MedicalFile {
    id: number;
    fileName: string;
    filePath: string;
    size: number;
    uploadedAt: string;
    patientId?: number;
}

// Real file upload using new backend endpoint
export const uploadMedicalFile = async (file: File, patientId: number): Promise<MedicalFile> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('patientId', patientId.toString());

    const response = await AxiosClient.post('/file/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// Get files for a specific patient using new backend endpoint
export const getPatientFiles = async (patientId: number): Promise<{ data: MedicalFile[] }> => {
    const response = await AxiosClient.get<MedicalFile[]>(`/file/patient/${patientId}`);
    return { data: response.data };
};

// Real file download using new backend endpoint
export const downloadFile = async (fileId: number) => {
    const response = await AxiosClient.get(`/file/download/${fileId}`, {
        responseType: 'blob'
    });
    return { data: response.data };
};

// Preview file (for inline viewing)
export const previewFile = async (fileId: number) => {
    const response = await AxiosClient.get(`/file/preview/${fileId}`, {
        responseType: 'blob'
    });
    return { data: response.data };
};

// Get file information for review
export const getFileInfo = async (fileId: number) => {
    const response = await AxiosClient.get(`/file/info/${fileId}`);
    return response.data;
};

// Existing API functions (using the backend endpoints)
export const addFile = (file: Omit<MedicalFile, 'id'>) => AxiosClient.post("/file", file);
export const getFiles = () => AxiosClient.get<MedicalFile[]>("/file");
export const getFileById = (id: number) => AxiosClient.get<MedicalFile>(`/file/${id}`);
export const updateFile = (file: MedicalFile) => AxiosClient.put(`/file/${file.id}`, file);
export const deleteFile = (id: number) => AxiosClient.delete(`/file/${id}`);
