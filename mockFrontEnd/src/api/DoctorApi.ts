import AxiosClient from "./AxiosClient";


export type Status = "Online" | "Offline" | "Busy";
export interface Doctor {
    id: number;
    name: string;
    specialty: string;
    department: string;
    phoneNumber: number;
    status: Status;
}

export const addDoctor = (doctor: Doctor) => AxiosClient.post("/doctors", doctor);
export const getAllDoctors = () => AxiosClient.get<Doctor[]>("/doctors");
export const getDoctorById = (id: number) => AxiosClient.get<Doctor>(`/doctors/${id}`);
export const searchDoctors = (params: { name: string; specialty: string; department: string; status: Status }) =>
    AxiosClient.get<Doctor[]>("/doctors/search", { params });

export const editDoctor = (id: number, doctor: Doctor) => AxiosClient.put(`/doctors/${id}`, doctor);

export const deleteDoctor = (id: number) => {
    return AxiosClient.delete(`/doctors/${id}`);
}
