import AxiosClient from "./AxiosClient";

export type AppointmentStatus = "Scheduled" | "Completed" | "Canceled";

export interface Doctor {
    id: number;
    name: string;
    specialty: string;
    department: string;
    phoneNumber: number;
    status: "Online" | "Offline" | "Busy";
}

export interface Patient {
    id: number;
    name: string;
    dateOfBirth: string;
    gender: string;
    phoneNumber?: string;
    email?: string;
    medicalRecord?: string;
}

export interface Appointment {
    id: number;
    patientId: number;
    doctorId: number;
    date: string;
    startTime: string;
    endTime: string;
    status: AppointmentStatus;
    description?: string;
    location?: string;
    doctor?: Doctor;
    patient?: Patient;
}

// For creating appointments - match backend AppointmentEntity structure
export interface CreateAppointmentRequest {
    doctorId: number;
    patientId: number;
    date: string;
    startTime: string;
    endTime: string;
    description?: string;
    location?: string;
    status: number; // 0 = Scheduled, 1 = Completed, 2 = Canceled
    doctor: {
        id: number;
        name: string;
        specialty: string;
        department: string;
        phoneNumber: number;
        status: number; // 0 = Online, 1 = Offline, 2 = Busy
    };
    patient: {
        id: number;
        name: string;
        dateOfBirth: string;
        gender: string;
        phoneNumber?: string;
        email?: string;
        medicalRecord?: string;
    };
}

export const addAppointment = async (appointment: CreateAppointmentRequest) => {
    console.log('Sending appointment request:', appointment);

    // Backend expects request wrapped in appointment object
    const wrappedRequest = { appointment };
    console.log('Wrapped request:', wrappedRequest);

    try {
        const response = await AxiosClient.post("/appointments", wrappedRequest);
        console.log('Appointment created successfully:', response.data);
        return response;
    } catch (error: any) {
        console.error('Appointment creation failed:', error);
        if (error.response) {
            console.error('Error response data:', error.response.data);
            console.error('Error status:', error.response.status);
        }
        throw error;
    }
};
export const getAppointments = () => AxiosClient.get<Appointment[]>("/appointments");
export const getAppointmentById = (id: number) => AxiosClient.get<Appointment>(`/appointments/${id}`);
export const updateAppointment = (id: number, appointment: CreateAppointmentRequest) => AxiosClient.put(`/appointments/${id}`, appointment);
export const deleteAppointment = (id: number) => AxiosClient.delete(`/appointments/${id}`);
