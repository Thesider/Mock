
import React, { useState, useEffect } from 'react';
import './Profile.css';
import { useLocation } from 'react-router-dom';
import { GetUserById } from '../../api/UserApi';
import { getPatientByName, updatePatient, addPatient } from '../../api/PatientApi';
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
          setUser(userData);

          // Try to fetch patient data by matching username with patient name
          let foundPatient = false;
          try {
            const patientResponse = await getPatientByName(userData.username);
            if (patientResponse.data) {
              foundPatient = true;
              setPatient(patientResponse.data);
              setEditedPatient(patientResponse.data);
            } else {
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
          } catch (patientErr) {
            console.log('No patient record found for user, can create new one');
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

          if (navState.new && !foundPatient) {
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
          } catch {
            console.warn('Could not parse user data from localStorage');
          }
        }

        // Fetch user data
        const userResponse = await GetUserById(userId);
        const userData = userResponse.data;
        setUser(userData);

        // Try to fetch patient data by matching username with patient name
        let foundPatient = false;
        try {
          const patientResponse = await getPatientByName(userData.username);
          if (patientResponse.data) {
            foundPatient = true;
            setPatient(patientResponse.data);
            setEditedPatient(patientResponse.data);
          } else {
            // No patient record found, user can create one
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
        } catch (patientErr) {
          console.log('No patient record found for user, can create new one');
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

        // If redirected after registration, open edit mode when no patient exists
        if (params.get('new') === 'true' && !foundPatient) {
          setIsEditing(true);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        // If fetching fails, allow the user to still complete their profile.
        setError(null);
        setPatient(null);

        // Try to use cached user from localStorage as a fallback so the editor can prefill name
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
          } catch {
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

        // Open editor so user can complete profile even if fetching failed
        setIsEditing(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [location.search]);

  const handleSave = async () => {
    if (!editedPatient.name || !editedPatient.dateOfBirth || !editedPatient.gender) {
      setError('Please fill in all required fields (Name, Date of Birth, Gender)');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const patientData: Patient = {
        id: patient?.id || 0,
        name: editedPatient.name!,
        dateOfBirth: editedPatient.dateOfBirth!,
        gender: editedPatient.gender!,
        phoneNumber: editedPatient.phoneNumber || '',
        email: editedPatient.email || '',
        medicalRecord: editedPatient.medicalRecord || ''
      };

      if (patient) {
        // Update existing patient
        await updatePatient(patientData);
        setPatient(patientData);
      } else {
        // Create new patient
        const response = await addPatient(patientData);
        setPatient(response.data);
      }

      setIsEditing(false);
    } catch (err: any) {
      setError('Failed to save patient data: ' + (err.message || 'Unknown error'));
      console.error('Error saving patient data:', err);
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
            <button type="button" className="edit-btn" onClick={() => setIsEditing(true)}>
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
                <input
                  type="text"
                  value={editedPatient.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                />
              ) : (
                <span>{patient?.name || user?.username || ''}</span>
              )}
            </div>
            <div className="info-group">
              <label>Date of Birth</label>
              {isEditing ? (
                <input
                  type="date"
                  value={editedPatient.dateOfBirth ? editedPatient.dateOfBirth.split('T')[0] : ''}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value + 'T00:00:00')}
                  aria-label="Date of Birth"
                />
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
                <input
                  type="tel"
                  value={editedPatient.phoneNumber || ''}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  placeholder="Enter your phone number"
                />
              ) : (
                <span>{patient?.phoneNumber || 'Not provided'}</span>
              )}
            </div>
            <div className="info-group">
              <label>Email Address</label>
              {isEditing ? (
                <input
                  type="email"
                  value={editedPatient.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email address"
                />
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
