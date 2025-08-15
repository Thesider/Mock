import React, { useState } from "react";
import { deleteDoctor, editDoctor } from "../../../api/DoctorApi";
import type { Doctor as DoctorType, Status } from "../../../api/DoctorApi";
import doctorStyles from "../styles/doctor.module.css";
import listStyles from "../styles/DoctorList.module.css";
interface DoctorListProps {
  doctors: DoctorType[];
  onDoctorUpdated: () => void;
  onError: (error: string) => void;
  searchQuery: string;
  onClearSearch: () => void;
}

const DoctorList: React.FC<DoctorListProps> = ({
  doctors,
  onDoctorUpdated,
  onError,
  searchQuery,
  onClearSearch,
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Omit<DoctorType, "id">>({
    name: "",
    specialty: "",
    department: "",
    phoneNumber: 0,
    status: "Online",
  });
  const [editFormErrors, setEditFormErrors] = useState<
    Partial<Record<keyof typeof editForm, string>>
  >({});

  // Validation helpers
  const validateField = (name: string, value: any) => {
    switch (name) {
      case "name":
      case "specialty":
      case "department":
        if (!value || value.trim() === "") return "This field is required";
        break;
      case "phoneNumber":
        if (!value || isNaN(value) || value <= 0)
          return "Please enter a valid phone number";
        break;
      case "status":
        if (!["Online", "Offline", "Busy"].includes(value))
          return "Invalid status selected";
        break;
      default:
        break;
    }
    return "";
  };

  const getStatusBadge = (status: Status) => {
    const statusClass =
      status === "Online"
        ? "statusOnline"
        : status === "Busy"
          ? "statusBusy"
          : "statusOffline";
    const dotClass =
      status === "Online"
        ? "statusDotOnline"
        : status === "Busy"
          ? "statusDotBusy"
          : "statusDotOffline";

    return (
      <span className={`statusBadge ${statusClass}`}>
        <div className={`statusDot ${dotClass}`}></div>
        {status}
      </span>
    );
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;

    try {
      await deleteDoctor(id);
      onDoctorUpdated();
    } catch {
      onError("Failed to delete doctor");
    }
  };

  const startEdit = (doctor: DoctorType) => {
    setEditingId(doctor.id);
    setEditForm({
      name: doctor.name,
      specialty: doctor.specialty,
      department: doctor.department,
      phoneNumber: doctor.phoneNumber,
      status: doctor.status,
    });
    setEditFormErrors({});
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: name === "phoneNumber" ? Number(value) : value,
    }));
    setEditFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleEditInputBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const errorMsg = validateField(name, value);
    setEditFormErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleEditSave = async (id: number) => {
    const errors: typeof editFormErrors = {};
    (Object.keys(editForm) as (keyof typeof editForm)[]).forEach((key) => {
      const msg = validateField(key, editForm[key]);
      if (msg) errors[key] = msg;
    });
    setEditFormErrors(errors);
    if (Object.values(errors).some(Boolean)) return;

    try {
      await editDoctor(id, { id, ...editForm });
      setEditingId(null);
      onDoctorUpdated();
    } catch {
      onError("Failed to update doctor");
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditFormErrors({});
  };

  return (
    <div className={doctorStyles.card}>
      <div className={doctorStyles.cardHeader}>
        <h2 className={doctorStyles.cardTitle}>
          {searchQuery
            ? `Search Results (${doctors.length} found)`
            : `All Doctors (${doctors.length})`}
        </h2>
        {searchQuery && (
          <button
            type="button"
            onClick={onClearSearch}
            className={doctorStyles.button + " " + doctorStyles.buttonSecondary}
          >
            <span className={doctorStyles.buttonIcon}>×</span>
            Clear Search
          </button>
        )}
      </div>

      {doctors.length === 0 ? (
        <div className={doctorStyles.emptyState}>
          <div className={doctorStyles.emptyStateIcon}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {searchQuery ? (
                <path
                  d="M21 21L16.514 16.514M19 10.5C19 15.194 15.194 19 10.5 19S2 15.194 2 10.5 5.806 2 10.5 2 19 5.806 19 10.5Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : (
                <path
                  d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7ZM21 8V14M18 11H24"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </svg>
          </div>
          <h3 className={doctorStyles.emptyStateTitle}>
            {searchQuery ? "No doctors match your search" : "No doctors found"}
          </h3>
          <p className={doctorStyles.emptyStateText}>
            {searchQuery
              ? "Try adjusting your search criteria or clear the search to see all doctors."
              : "Get started by adding your first doctor."}
          </p>
        </div>
      ) : (
        <div className={listStyles.tableContainer}>
          <table className={listStyles.table}>
            <thead className={listStyles.tableHeader}>
              <tr>
                <th className={listStyles.tableHeaderCell}>ID</th>
                <th className={listStyles.tableHeaderCell}>Name</th>
                <th className={listStyles.tableHeaderCell}>Specialty</th>
                <th className={listStyles.tableHeaderCell}>Department</th>
                <th className={listStyles.tableHeaderCell}>Phone</th>
                <th className={listStyles.tableHeaderCell}>Status</th>
                <th className={listStyles.tableHeaderCell}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr key={doctor.id} className={listStyles.tableRow}>
                  <td className={listStyles.tableCell}>{doctor.id}</td>
                  {editingId === doctor.id ? (
                    <>
                      <td className={listStyles.tableCell}>
                        <input
                          name="name"
                          value={editForm.name}
                          onChange={handleEditInputChange}
                          onBlur={handleEditInputBlur}
                          className={
                            doctorStyles.editInput +
                            (editFormErrors.name
                              ? " " + doctorStyles.editError
                              : "")
                          }
                          placeholder="Enter doctor's name"
                        />
                        {editFormErrors.name && (
                          <div className={doctorStyles.editErrorText}>
                            {editFormErrors.name}
                          </div>
                        )}
                      </td>
                      <td className={listStyles.tableCell}>
                        <input
                          name="specialty"
                          value={editForm.specialty}
                          onChange={handleEditInputChange}
                          onBlur={handleEditInputBlur}
                          className={
                            doctorStyles.editInput +
                            (editFormErrors.specialty
                              ? " " + doctorStyles.editError
                              : "")
                          }
                          placeholder="Specialty"
                        />
                        {editFormErrors.specialty && (
                          <div className={doctorStyles.editErrorText}>
                            {editFormErrors.specialty}
                          </div>
                        )}
                      </td>
                      <td className={listStyles.tableCell}>
                        <input
                          name="department"
                          value={editForm.department}
                          onChange={handleEditInputChange}
                          onBlur={handleEditInputBlur}
                          className={
                            doctorStyles.editInput +
                            (editFormErrors.department
                              ? " " + doctorStyles.editError
                              : "")
                          }
                          placeholder="Department"
                        />
                        {editFormErrors.department && (
                          <div className={doctorStyles.editErrorText}>
                            {editFormErrors.department}
                          </div>
                        )}
                      </td>
                      <td className={listStyles.tableCell}>
                        <input
                          name="phoneNumber"
                          type="number"
                          value={editForm.phoneNumber}
                          onChange={handleEditInputChange}
                          onBlur={handleEditInputBlur}
                          className={
                            doctorStyles.editInput +
                            (editFormErrors.phoneNumber
                              ? " " + doctorStyles.editError
                              : "")
                          }
                          placeholder="Phone Number"
                        />
                        {editFormErrors.phoneNumber && (
                          <div className={doctorStyles.editErrorText}>
                            {editFormErrors.phoneNumber}
                          </div>
                        )}
                      </td>
                      <td className={listStyles.tableCell}>
                        <select
                          name="status"
                          value={editForm.status}
                          onChange={handleEditInputChange}
                          onBlur={handleEditInputBlur}
                          className={
                            doctorStyles.editSelect +
                            (editFormErrors.status
                              ? " " + doctorStyles.editError
                              : "")
                          }
                          id={`edit-status-${doctor.id}`}
                          aria-label="Status"
                        >
                          <option value="Online">Online</option>
                          <option value="Offline">Offline</option>
                          <option value="Busy">Busy</option>
                        </select>
                        {editFormErrors.status && (
                          <div className={doctorStyles.editErrorText}>
                            {editFormErrors.status}
                          </div>
                        )}
                      </td>
                      <td className={listStyles.tableCell}>
                        <div className={doctorStyles.actionButtons}>
                          <button
                            type="button"
                            onClick={() => handleEditSave(doctor.id)}
                            className={
                              doctorStyles.button +
                              " " +
                              doctorStyles.buttonSuccess +
                              " " +
                              doctorStyles.iconButton
                            }
                            title="Save changes"
                          >
                            <span className={doctorStyles.buttonIcon}>✓</span>
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={handleEditCancel}
                            className={
                              doctorStyles.button +
                              " " +
                              doctorStyles.buttonSecondary +
                              " " +
                              doctorStyles.iconButton
                            }
                            title="Cancel editing"
                          >
                            <span className={doctorStyles.buttonIcon}>×</span>
                            Cancel
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td
                        className={
                          listStyles.tableCell + " " + listStyles.tableCellName
                        }
                      >
                        {doctor.name}
                      </td>
                      <td className={listStyles.tableCell}>
                        {doctor.specialty}
                      </td>
                      <td className={listStyles.tableCell}>
                        {doctor.department}
                      </td>
                      <td
                        className={
                          listStyles.tableCell + " " + listStyles.tableCellPhone
                        }
                      >
                        {doctor.phoneNumber.toLocaleString()}
                      </td>
                      <td className={listStyles.tableCell}>
                        {getStatusBadge(doctor.status)}
                      </td>
                      <td className={listStyles.tableCell}>
                        <div className={doctorStyles.actionButtons}>
                          <button
                            type="button"
                            onClick={() => startEdit(doctor)}
                            className={
                              doctorStyles.button +
                              " " +
                              doctorStyles.buttonSecondary +
                              " " +
                              doctorStyles.iconButton
                            }
                            title="Edit doctor"
                          >
                            <span className={doctorStyles.buttonIcon}>✎</span>
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(doctor.id)}
                            className={
                              doctorStyles.button +
                              " " +
                              doctorStyles.buttonDanger +
                              " " +
                              doctorStyles.iconButton
                            }
                            title="Delete doctor"
                          >
                            <span className={doctorStyles.buttonIcon}>×</span>
                            Delete
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DoctorList;
