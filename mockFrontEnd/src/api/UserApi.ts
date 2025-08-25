import AxiosClient from "./AxiosClient";

export type UserRole = "Admin" | "Doctor" | "Guest" | "Staff" | "User";

export interface User {
    id: number;
    username: string;
    password: string;
    role: UserRole;
    patientId?: number;
}

export const AddUser = async (user: User) => AxiosClient.post("/user", user);

export const GetUserById = async (id: number) => AxiosClient.get(`/user/${id}`);

export const GetAllUsers = async () => AxiosClient.get("/user");

export const UpdateUser = async (id: number, user: User) => AxiosClient.put(`/user/${id}`, user);

export const DeleteUser = async (id: number) => AxiosClient.delete(`/user/${id}`);
