import React, { useState, useEffect } from 'react';
import './Profile.css';
import { useLocation } from 'react-router-dom';
import { GetUserById, UpdateUser } from '../../api/UserApi';
import { getPatientById, getPatientByName, getAllPatients, updatePatient, addPatient } from '../../api/PatientApi';
import type { User } from '../../api/UserApi';
import type { Patient } from '../../api/PatientApi';

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editedPatient, setEditedPatient] = useState<Partial<Patient>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [k: string]: string }>({});
  const location = useLocation();

  // Fetch user and patient profile from API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams(location.search);
        const navState = (location as any).state as { new?: boolean; user?: User } | null;

        // If navigation state provided user (from registration), use it and skip fetching user by id
        if (navState?.user) {
          const userData = navState.user;
          const username = (userData as any).username || (userData as any).userName || '';
          setUser(userData);

          // If we have a cached patient for this user, use it first to avoid extra API calls
          try {
            const storedPatient = localStorage.getItem('patient');
            if (storedPatient) {
              const parsed = JSON.parse(storedPatient) as Patient;
              if (parsed && parsed.name === userData.username) {
                setPatient(parsed);
                setEditedPatient(parsed);
                setLoading(false);
                return;
              }
            }
          } catch (err) {
            // ignore parse errors
          }

          // Try to fetch patient data by matching username with patient name (guard if username missing)
          let foundPatient = false;
          if (username) {
            try {
              let patientResponse;
              try {
                // Prefer lookup by user id to reliably find the associated patient record
                var uid = (userData as any)?.id ?? 0;
                patientResponse = uid ? await getPatientById(uid) : { data: null };
              } catch (nameErr) {
                patientResponse = { data: null };
              }
              if (patientResponse && patientResponse.data) {
                foundPatient = true;
                setPatient(patientResponse.data);
                setEditedPatient(patientResponse.data);
              } else {
                // fallback: try to match from all patients (handles cases where patient.Name != username)
                try {
                  const allResp = await getAllPatients();
                  const list: Patient[] = allResp.data || [];
                  const fallback = list.find(p =>
                    p.name?.toLowerCase().includes(username?.toLowerCase() || '') ||
                    p.email?.toLowerCase() === (username || '').toLowerCase()
                  );
                  if (fallback) {
                    foundPatient = true;
                    setPatient(fallback);
                    setEditedPatient(fallback);
                  } else {
                    setPatient(null);
                    setEditedPatient({
                      name: username,
                      dateOfBirth: '',
                      gender: '',
                      phoneNumber: '',
                      email: '',
                      medicalRecord: ''
                    });
                  }
                } catch (err) {
                  setPatient(null);
                  setEditedPatient({
                    name: userData.username,
                    dateOfBirth: '',
                    gender: '',
                    phoneNumber: '',
                    email: '',
                    medicalRecord: ''
                  });
                }
              }
            } catch (patientErr) {
              setPatient(null);
              setEditedPatient({
                name: userData.username,
                dateOfBirth: '',
                gender: '',
                phoneNumber: '',
                email: '',
                medicalRecord: ''
              });
            }
          } else {
            setPatient(null);
            setEditedPatient({
              name: '',
              dateOfBirth: '',
              gender: '',
              phoneNumber: '',
              email: '',
              medicalRecord: ''
            });
          }

          // If redirected after registration, open edit mode when no patient exists
          if (navState.new && !foundPatient) {
            setIsEditing(true);
          }

          // If no patient was found, allow the user to edit (complete) their profile
          if (!foundPatient) {
            setIsEditing(true);
          }

          // Skip rest of fetchProfile when nav state contains user
          setLoading(false);
          return;
        }

        // Get user ID from localStorage
        let userId = 1; // Default fallback
        const userStorage = localStorage.getItem('user');
        if (userStorage) {
          try {
            const parsed = JSON.parse(userStorage);
            userId = parsed.id || 1;
          } catch (err) {
            console.warn('Could not parse user data from localStorage', err);
          }
        }

        // Fetch user data
        const userResponse = await GetUserById(userId);
        const userData = userResponse.data;
        const username = (userData as any).username || (userData as any).userName || '';
        setUser(userData);

        // If we have a cached patient for this user, use it first to avoid extra API calls
        try {
          const storedPatient = localStorage.getItem('patient');
          if (storedPatient) {
            const parsed = JSON.parse(storedPatient) as Patient;
            if (parsed && parsed.name === userData.username) {
              setPatient(parsed);
              setEditedPatient(parsed);
              setLoading(false);
              return;
            }
          }
        } catch (err) {
          // ignore parse errors
        }

        // Try to fetch patient data by matching username with patient name (guard if username missing)
        let foundPatient = false;
        if (username) {
          try {
            let patientResponse;
            try {
              // Use the known userId (from localStorage) to fetch the patient record by id
              const uid = userId ?? 0;
              patientResponse = uid ? await getPatientById(uid) : { data: null };
            } catch (nameErr) {
              patientResponse = { data: null };
            }
            if (patientResponse && patientResponse.data) {
              foundPatient = true;
              setPatient(patientResponse.data);
              setEditedPatient(patientResponse.data);
            } else {
              try {
                const allResp = await getAllPatients();
                const list: Patient[] = allResp.data || [];
                const fallback = list.find(p =>
                  p.name?.toLowerCase().includes(username?.toLowerCase() || '') ||
                  p.email?.toLowerCase() === (username || '').toLowerCase()
                );
                if (fallback) {
                  foundPatient = true;
                  setPatient(fallback);
                  setEditedPatient(fallback);
                } else {
                  // No patient record found, user can create one
                  setPatient(null);
                  setEditedPatient({
                    name: username,
                    dateOfBirth: '',
                    gender: '',
                    phoneNumber: '',
                    email: '',
                    medicalRecord: ''
                  });
                }
              } catch (err) {
                setPatient(null);
                setEditedPatient({
                  name: userData.username,
                  dateOfBirth: '',
                  gender: '',
                  phoneNumber: '',
                  email: '',
                  medicalRecord: ''
                });
              }
            }
          } catch (patientErr) {
            setPatient(null);
            setEditedPatient({
              name: userData.username,
              dateOfBirth: '',
              gender: '',
              phoneNumber: '',
              email: '',
              medicalRecord: ''
            });
          }
        } else {
          // No username available — prepare empty patient template so UI doesn't call backend with "undefined"
          setPatient(null);
          setEditedPatient({
            name: '',
            dateOfBirth: '',
            gender: '',
            phoneNumber: '',
            email: '',
            medicalRecord: ''
          });
        }

        // If redirected after registration, open edit mode when no patient exists
        if (params.get('new') === 'true' && !foundPatient) {
          setIsEditing(true);
        }

        // If no patient was found, enable edit mode so user can complete profile
        if (!foundPatient) {
          setIsEditing(true);
        }
      } catch (err) {
        console.error('Profile: Error fetching profile:', err);
        // If fetching fails, allow the user to still complete their profile.
        setError(null);
        setPatient(null);

        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setEditedPatient({
              name: parsedUser.username || '',
              dateOfBirth: '',
              gender: '',
              phoneNumber: '',
              email: '',
              medicalRecord: ''
            });
          } catch (err) {
            setUser(null);
            setEditedPatient({
              name: '',
              dateOfBirth: '',
              gender: '',
              phoneNumber: '',
              email: '',
              medicalRecord: ''
            });
          }
        } else {
          setUser(null);
          setEditedPatient({
            name: '',
            dateOfBirth: '',
            gender: '',
            phoneNumber: '',
            email: '',
            medicalRecord: ''
          });
        }

        // Allow editing so the user can input their info after a fetch failure
        setIsEditing(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [location.search]);

  const handleSave = async () => {
    // Clear previous errors
    setError(null);
    const errs: { [k: string]: string } = {};
    if (!editedPatient.name || editedPatient.name.trim() === '') errs.name = 'Full name is required.';
    if (!editedPatient.dateOfBirth) errs.dateOfBirth = 'Date of birth is required.';
    if (!editedPatient.gender) errs.gender = 'Gender is required.';
    if (editedPatient.email && !/^\S+@\S+\.\S+$/.test(editedPatient.email)) errs.email = 'Email address is invalid.';
    if (editedPatient.phoneNumber && !/^[\d+\-()\s]+$/.test(editedPatient.phoneNumber)) errs.phoneNumber = 'Phone number is invalid.';
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      setError('Please correct the highlighted fields.');
      return;
    }
    setFieldErrors({});

    try {
      setSaving(true);
      setError(null);

      const patientData: Patient = {
        id: (editedPatient as any).id ?? patient?.id ?? 0,
        name: editedPatient.name!,
        dateOfBirth: editedPatient.dateOfBirth!,
        gender: editedPatient.gender!,
        phoneNumber: editedPatient.phoneNumber || '',
        email: editedPatient.email || '',
        medicalRecord: editedPatient.medicalRecord || ''
      };

      if (patientData.id && patientData.id > 0) {
        // Update existing patient (PUT returns 204 No Content). Re-fetch the patient to get current server state.
        await updatePatient(patientData);
        let updated;
        try {
          const getResp = await getPatientById(patientData.id);
          updated = getResp?.data ?? patientData;
        } catch (err) {
          // If re-fetch fails, fall back to the local patientData object
          updated = patientData;
        }
        setPatient(updated);
        try {
          localStorage.setItem('patient', JSON.stringify(updated));
          localStorage.setItem('patientId', String(updated.id));
        } catch (err) {
        }

        // Ensure user's patientId is linked in localStorage and backend
        try {
          const userStorage = localStorage.getItem('user');
          if (userStorage) {
            const parsedUser = JSON.parse(userStorage);
            if (parsedUser && parsedUser.id) {
              const updatedUser = { ...parsedUser, patientId: updated.id };
              await UpdateUser(parsedUser.id, updatedUser);
              localStorage.setItem('user', JSON.stringify(updatedUser));
              setUser(updatedUser);
            }
          }
        } catch (err) {
          console.error('Profile: Failed to link patient to user on update', err);
        }
      } else {
        const response = await addPatient(patientData);
        const newPatient = response.data;
        setPatient(newPatient);
        try {
          localStorage.setItem('patient', JSON.stringify(newPatient));
          localStorage.setItem('patientId', String(newPatient.id));
        } catch (err) {
          // ignore storage errors
        }

        // Link patient to current user
        try {
          const userStorage = localStorage.getItem('user');
          if (userStorage) {
            const parsedUser = JSON.parse(userStorage);
            const updatedUser = { ...parsedUser, patientId: newPatient.id };
            await UpdateUser(parsedUser.id, updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            localStorage.setItem('patientId', String(newPatient.id));
            setUser(updatedUser);
          }
        } catch (err) {
          console.error('Profile: Failed to link patient to user', err);
        }
      }

      setIsEditing(false);
      setSuccessMessage('Profile saved successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError('Failed to save patient data: ' + (err.message || 'Unknown error'));
      console.error('Profile: Error saving patient data:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedPatient(patient || {
      name: user?.username || '',
      dateOfBirth: '',
      gender: '',
      phoneNumber: '',
      email: '',
      medicalRecord: ''
    });
    setError(null);
  };

  const handleInputChange = (field: keyof Patient, value: string) => {
    setEditedPatient(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="error">
          <p>{error}</p>
          <button type="button" onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  if (!user && !isEditing) {
    return (
      <div className="profile-container">
        <div className="error">User not found</div>
      </div>
    );
  }

  return (
    <div className="profile">
      <div className="page-header">
        <h1>My Profile</h1>
        <div className="header-actions">
          {!isEditing ? (
            <button
              type="button"
              className="edit-btn"
              onClick={() => {
                // Ensure form is populated with the current patient when entering edit mode
                setEditedPatient(
                  patient ? { ...patient } : {
                    name: user?.username || '',
                    dateOfBirth: '',
                    gender: '',
                    phoneNumber: '',
                    email: '',
                    medicalRecord: ''
                  }
                );
                setIsEditing(true);
              }}
            >
              {patient ? 'Edit Profile' : 'Complete Profile'}
            </button>
          ) : (
            <>
              <button
                type="button"
                className="save-btn"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" className="cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
            </>
          )}
        </div>
        {successMessage && (
          <div className="save-success" role="status" aria-live="polite">{successMessage}</div>
        )}
      </div>

      <div className="profile-content">
        {/* Basic Information Section */}
        <div className="profile-section">
          <div className="section-header">
            <h2>Basic Information</h2>
          </div>
          <div className="info-grid">
            <div className="info-group">
              <label>Full Name</label>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={editedPatient.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                  />
                  {fieldErrors.name && <div className="error">{fieldErrors.name}</div>}
                </>
              ) : (
                <span>{patient?.name || ''}</span>
              )}
            </div>
            <div className="info-group">
              <label>Date of Birth</label>
              {isEditing ? (
                <>
                  <input
                    type="date"
                    value={editedPatient.dateOfBirth ? editedPatient.dateOfBirth.split('T')[0] : ''}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value + 'T00:00:00')}
                    aria-label="Date of Birth"
                  />
                  {fieldErrors.dateOfBirth && <div className="error">{fieldErrors.dateOfBirth}</div>}
                </>
              ) : (
                <span>
                  {patient?.dateOfBirth
                    ? new Date(patient.dateOfBirth).toLocaleDateString()
                    : 'Not provided'
                  }
                </span>
              )}
            </div>
            <div className="info-group">
              <label>Gender</label>
              {isEditing ? (
                <>
                  <select
                    value={editedPatient.gender || ''}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    aria-label="Gender"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {fieldErrors.gender && <div className="error">{fieldErrors.gender}</div>}
                </>
              ) : (
                <span>{patient?.gender || 'Not provided'}</span>
              )}
            </div>
            <div className="info-group">
              <label>User Role</label>
              <span>{user?.role || ''}</span>
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="profile-section">
          <div className="section-header">
            <h2>Contact Information</h2>
          </div>
          <div className="info-grid">
            <div className="info-group">
              <label>Phone Number</label>
              {isEditing ? (
                <>
                  <input
                    type="tel"
                    value={editedPatient.phoneNumber || ''}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    placeholder="Enter your phone number"
                  />
                  {fieldErrors.phoneNumber && <div className="error">{fieldErrors.phoneNumber}</div>}
                </>
              ) : (
                <span>{patient?.phoneNumber || 'Not provided'}</span>
              )}
            </div>
            <div className="info-group">
              <label>Email Address</label>
              {isEditing ? (
                <>
                  <input
                    type="email"
                    value={editedPatient.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email address"
                  />
                  {fieldErrors.email && <div className="error">{fieldErrors.email}</div>}
                </>
              ) : (
                <span>{patient?.email || 'Not provided'}</span>
              )}
            </div>
          </div>
        </div>

        {/* Medical Information Section */}
        <div className="profile-section">
          <div className="section-header">
            <h2>Medical Information</h2>
          </div>
          <div className="info-grid">
            <div className="info-group full-width">
              <label>Medical Record Notes</label>
              {isEditing ? (
                <textarea
                  className="medical-textarea"
                  value={editedPatient.medicalRecord || ''}
                  onChange={(e) => handleInputChange('medicalRecord', e.target.value)}
                  placeholder="Enter any medical notes, allergies, or important information"
                  rows={4}
                />
              ) : (
                <span>{patient?.medicalRecord || 'No medical records provided'}</span>
              )}
            </div>
          </div>
        </div>

        {!patient && !isEditing && (
          <div className="profile-section">
            <div className="section-header">
              <h2>Complete Your Profile</h2>
            </div>
            <p className="incomplete-profile-message">
              You haven't completed your patient profile yet. Click "Complete Profile" above to add your medical information.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
