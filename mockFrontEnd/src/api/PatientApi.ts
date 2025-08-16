import AxiosClient from "./AxiosClient";

export interface Patient {
  id: number;
  name: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber?: string;
  email?: string;
  medicalRecord?: string;
}

export const addPatient = (patient: Patient) => AxiosClient.post("/Patient", patient);
export const updatePatient = (patient: Patient) => AxiosClient.put(`/Patient/${patient.id}`, patient);
export const getAllPatients = () => AxiosClient.get<Patient[]>("/Patient");
export const getPatientById = (id: number) => AxiosClient.get<Patient>(`/Patient/${id}`);
export const getPatientByName = (name: string) => AxiosClient.get<Patient>(`/Patient/by-name/${name}`);
export const deletePatient = (id: number) => AxiosClient.delete(`/Patient/${id}`);