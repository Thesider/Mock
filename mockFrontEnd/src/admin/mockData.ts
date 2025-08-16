export interface BookingItem {
  id: string;
  patient: string;
  doctor: string;
  time: string; // ISO-like 'YYYY-MM-DD HH:mm'
  status: "Đã xác nhận" | "Đang chờ" | "Đã hủy";
}

export const summaryData = [
  {
    title: "Total Appointments",
    value: 120,
  },
  {
    title: "Completed Appointments",
    value: 95,
  },
  {
    title: "Total Revenue",
    value: "45,000,000₫",
  },
  {
    title: "New Patients",
    value: 18,
  },
];

export const bookingChartData = [
  { day: "Thứ 2", bookings: 10 },
  { day: "Thứ 3", bookings: 25 },
  { day: "Thứ 4", bookings: 40 },
  { day: "Thứ 5", bookings: 20 },
  { day: "Thứ 6", bookings: 30 },
  { day: "Thứ 7", bookings: 50 },
  { day: "CN", bookings: 45 },
];

export const recentBookings: BookingItem[] = [
  {
    id: "B001",
    patient: "Nguyen Van A",
    doctor: "Dr. Tran Van B",
    time: "2025-08-15 09:00",
    status: "Đã xác nhận",
  },
  {
    id: "B002",
    patient: "Le Thi C",
    doctor: "Dr. Nguyen Van D",
    time: "2025-08-15 10:30",
    status: "Đang chờ",
  },
  {
    id: "B003",
    patient: "Pham Van E",
    doctor: "Dr. Tran Van F",
    time: "2025-08-15 11:00",
    status: "Đã hủy",
  },
  {
    id: "B004",
    patient: "Tran Thi G",
    doctor: "Dr. Le Van H",
    time: "2025-08-15 13:00",
    status: "Đã xác nhận",
  },
  {
    id: "B005",
    patient: "Ngo Van I",
    doctor: "Dr. Nguyen Van J",
    time: "2025-08-15 14:30",
    status: "Đang chờ",
  },
];

export const servicePieData = [
  { name: "General Checkup", value: 400 },
  { name: "Internal Medicine", value: 300 },
  { name: "Dermatology", value: 200 },
];

export const pieColors = ["#1890ff", "#52c41a", "#faad14"];

export const calendarBookings: Record<string, BookingItem[]> = {
  "2025-08-15": [recentBookings[0], recentBookings[1]],
  "2025-08-16": [recentBookings[2]],
};

export const statusColors: Record<
  BookingItem["status"],
  "processing" | "warning" | "error"
> = {
  "Đã xác nhận": "processing",
  "Đang chờ": "warning",
  "Đã hủy": "error",
};

// Extra mock entities for the other admin pages
export interface DoctorItem {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  status: "Đang làm việc" | "Tạm nghỉ";
}

export const mockDoctors: DoctorItem[] = [
  {
    id: "D001",
    name: "Dr. Tran Van B",
    specialty: "Internal Medicine",
    phone: "0901 234 567",
    status: "Đang làm việc",
  },
  {
    id: "D002",
    name: "Dr. Nguyen Van D",
    specialty: "Dermatology",
    phone: "0902 345 678",
    status: "Đang làm việc",
  },
  {
    id: "D003",
    name: "Dr. Le Van H",
    specialty: "General Surgery",
    phone: "0903 456 789",
    status: "Tạm nghỉ",
  },
];

export interface PatientItem {
  id: string;
  name: string;
  age: number;
  phone: string;
  lastVisit: string; // YYYY-MM-DD
}

export const mockPatients: PatientItem[] = [
  {
    id: "P001",
    name: "Nguyen Van A",
    age: 28,
    phone: "0911 111 111",
    lastVisit: "2025-08-01",
  },
  {
    id: "P002",
    name: "Le Thi C",
    age: 34,
    phone: "0922 222 222",
    lastVisit: "2025-08-10",
  },
  {
    id: "P003",
    name: "Pham Van E",
    age: 45,
    phone: "0933 333 333",
    lastVisit: "2025-07-25",
  },
];
