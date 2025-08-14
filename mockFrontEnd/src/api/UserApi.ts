import AxiosClient  from "axios";

export type UserRole = "Admin" | "Doctor" | "Guest"|"Staff"|"User";

export interface User {
    id: number;
    username: string;
    password: string;
    role: UserRole;

}

export const AddUser = async (user: User) => AxiosClient.post("/users", user);

export const GetUserById = async (id: number) => AxiosClient.get(`/users/${id}`);

export const GetAllUsers = async () => AxiosClient.get("/users");

export const UpdateUser = async (id: number, user: User) => AxiosClient.put(`/users/${id}`, user);

export const DeleteUser = async (id: number) => AxiosClient.delete(`/users/${id}`);
