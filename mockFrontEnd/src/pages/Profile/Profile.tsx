import React, { useState, useEffect } from "react";
import "./Profile.css";
import { useLocation } from "react-router-dom";
import { GetUserById } from "../../api/UserApi";
import {
  getPatientById,
  updatePatient,
  addPatient,
} from "../../api/PatientApi";
import type { User } from "../../api/UserApi";
import type { Patient } from "../../api/PatientApi";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editedPatient, setEditedPatient] = useState<Partial<Patient>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const location = useLocation();

  // fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        let userId = 1;
        const userStorage = localStorage.getItem("user");
        if (userStorage) {
          try {
            const parsed = JSON.parse(userStorage);
            userId = parsed.id || 1;
          } catch {}
        }

        const userResponse = await GetUserById(userId);
        const userData = userResponse.data;
        setUser(userData);

        const patientResponse = await getPatientById(userId);
        if (patientResponse.data) {
          setPatient(patientResponse.data);
          setEditedPatient(patientResponse.data);
        } else {
          setPatient(null);
          setIsEditing(true);
        }
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [location.search]);

  const handleSave = async () => {
    if (
      !editedPatient.name ||
      !editedPatient.dateOfBirth ||
      !editedPatient.gender
    ) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const patientData: Patient = {
        id: (editedPatient as any).id ?? patient?.id ?? 0,
        name: editedPatient.name!,
        dateOfBirth: editedPatient.dateOfBirth!,
        gender: editedPatient.gender!,
        phoneNumber: editedPatient.phoneNumber || "",
        email: editedPatient.email || "",
        medicalRecord: editedPatient.medicalRecord || "",
      };

      if (patientData.id > 0) {
        await updatePatient(patientData);
        setPatient(patientData);
      } else {
        const response = await addPatient(patientData);
        setPatient(response.data);
      }

      setIsEditing(false);
      setSuccessMessage("Profile saved successfully");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError("Failed to save profile: " + (err.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedPatient(
      patient || {
        name: user?.username || "",
        dateOfBirth: "",
        gender: "",
        phoneNumber: "",
        email: "",
        medicalRecord: "",
      }
    );
    setError(null);
  };

  const handleInputChange = (field: keyof Patient, value: string) => {
    setEditedPatient((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) return <div className="loading">Loading profile...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="profile-page">
      <Header />

      <main className="profile-main">
        <div className="profile">
          <div className="page-header">
            <h1>My Profile</h1>
            {successMessage && (
              <div className="save-success">{successMessage}</div>
            )}
          </div>

          <div className="profile-content">
            {/* Basic Information */}
            <div className="profile-section">
              <h2>Basic Information</h2>
              <div className="info-grid">
                <div className="info-group">
                  <label>Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedPatient.name || ""}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                    />
                  ) : (
                    <span>{patient?.name}</span>
                  )}
                </div>
                <div className="info-group">
                  <label>Date of Birth</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editedPatient.dateOfBirth?.split("T")[0] || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "dateOfBirth",
                          e.target.value + "T00:00:00"
                        )
                      }
                    />
                  ) : (
                    <span>
                      {patient?.dateOfBirth
                        ? new Date(patient.dateOfBirth).toLocaleDateString()
                        : ""}
                    </span>
                  )}
                </div>
                <div className="info-group">
                  <label>Gender</label>
                  {isEditing ? (
                    <select
                      value={editedPatient.gender || ""}
                      onChange={(e) =>
                        handleInputChange("gender", e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <span>{patient?.gender}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="profile-section">
              <h2>Contact Information</h2>
              <div className="info-grid">
                <div className="info-group">
                  <label>Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedPatient.phoneNumber || ""}
                      onChange={(e) =>
                        handleInputChange("phoneNumber", e.target.value)
                      }
                    />
                  ) : (
                    <span>{patient?.phoneNumber}</span>
                  )}
                </div>
                <div className="info-group">
                  <label>Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedPatient.email || ""}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                    />
                  ) : (
                    <span>{patient?.email}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="profile-section">
              <h2>Medical Information</h2>
              <div className="info-group full-width">
                <label>Medical Notes</label>
                {isEditing ? (
                  <textarea
                    value={editedPatient.medicalRecord || ""}
                    onChange={(e) =>
                      handleInputChange("medicalRecord", e.target.value)
                    }
                  />
                ) : (
                  <span>
                    {patient?.medicalRecord || "No medical records provided"}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons moved to bottom */}
          <div className="profile-actions">
            {!isEditing ? (
              <button
                type="button"
                className="edit-btn"
                onClick={() => {
                  setEditedPatient(
                    patient || {
                      name: user?.username || "",
                      dateOfBirth: "",
                      gender: "",
                      phoneNumber: "",
                      email: "",
                      medicalRecord: "",
                    }
                  );
                  setIsEditing(true);
                }}
              >
                {patient ? "Edit Profile" : "Complete Profile"}
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="save-btn"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
