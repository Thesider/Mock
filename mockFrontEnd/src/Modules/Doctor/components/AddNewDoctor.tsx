import React, { useState } from 'react';
import { addDoctor } from '../../../api/DoctorApi';
import type { Doctor as DoctorType, Status } from '../../../api/DoctorApi';
import addStyles from './AddNewDoctor.module.css';

interface AddNewDoctorProps {
    onDoctorAdded: () => void;
    onCancel: () => void;
    onError: (error: string) => void;
}

const AddNewDoctor: React.FC<AddNewDoctorProps> = ({ onDoctorAdded, onCancel, onError }) => {
    const [form, setForm] = useState<Omit<DoctorType, 'id'>>({
        name: '',
        specialty: '',
        department: '',
        phoneNumber: 0,
        status: 'Online'
    });
    const [formErrors, setFormErrors] = useState<Partial<Record<keyof typeof form, string>>>({});
    const [creating, setCreating] = useState(false);

    // Validation helpers
    const validateField = (name: string, value: any) => {
        switch (name) {
            case 'name':
            case 'specialty':
            case 'department':
                if (!value || value.trim() === '') return 'This field is required';
                break;
            case 'phoneNumber':
                if (!value || isNaN(value) || value <= 0) return 'Please enter a valid phone number';
                break;
            case 'status':
                if (!['Online', 'Offline', 'Busy'].includes(value)) return 'Invalid status selected';
                break;
            default:
                break;
        }
        return '';
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: name === 'phoneNumber' ? Number(value) : value }));
        setFormErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const errorMsg = validateField(name, value);
        setFormErrors(prev => ({ ...prev, [name]: errorMsg }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errors: typeof formErrors = {};
        (Object.keys(form) as (keyof typeof form)[]).forEach(key => {
            const msg = validateField(key, form[key]);
            if (msg) errors[key] = msg;
        });
        setFormErrors(errors);
        if (Object.values(errors).some(Boolean)) return;

        setCreating(true);
        try {
            await addDoctor(form as DoctorType);
            setForm({ name: '', specialty: '', department: '', phoneNumber: 0, status: 'Online' });
            setFormErrors({});
            onDoctorAdded();
        } catch {
            onError('Failed to create doctor');
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className={addStyles.card}>
            <div className={addStyles.cardHeader}>
                <h2 className={addStyles.cardTitle}>
                    Add New Doctor
                </h2>
                <button
                    type="button"
                    onClick={onCancel}
                    className={addStyles.button + ' ' + addStyles.buttonSecondary}
                >
                    <span className={addStyles.buttonIcon}>×</span>
                    Cancel
                </button>
            </div>

            <form onSubmit={handleSubmit} className={addStyles.form}>
                <div className={addStyles.formGrid}>
                    {/* Name Field */}
                    <div className={addStyles.formGroup}>
                        <label className={addStyles.label}>
                            Name
                        </label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            placeholder="Enter doctor's name"
                            className={addStyles.input + (formErrors.name ? ' ' + addStyles.error : '')}
                            required
                        />
                        {formErrors.name && (
                            <div className={addStyles.errorMessage}>
                                {formErrors.name}
                            </div>
                        )}
                    </div>

                    {/* Specialty Field */}
                    <div className={addStyles.formGroup}>
                        <label className={addStyles.label}>
                            Specialty
                        </label>
                        <input
                            name="specialty"
                            value={form.specialty}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            placeholder="Enter specialty"
                            className={addStyles.input + (formErrors.specialty ? ' ' + addStyles.error : '')}
                            required
                        />
                        {formErrors.specialty && (
                            <div className={addStyles.errorMessage}>
                                {formErrors.specialty}
                            </div>
                        )}
                    </div>

                    {/* Department Field */}
                    <div className={addStyles.formGroup}>
                        <label className={addStyles.label}>
                            Department
                        </label>
                        <input
                            name="department"
                            value={form.department}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            placeholder="Enter department"
                            className={addStyles.input + (formErrors.department ? ' ' + addStyles.error : '')}
                            required
                        />
                        {formErrors.department && (
                            <div className={addStyles.errorMessage}>
                                {formErrors.department}
                            </div>
                        )}
                    </div>

                    {/* Phone Number Field */}
                    <div className={addStyles.formGroup}>
                        <label className={addStyles.label}>
                            Phone Number
                        </label>
                        <input
                            name="phoneNumber"
                            type="number"
                            value={form.phoneNumber || ''}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            placeholder="Enter phone number"
                            className={addStyles.input + (formErrors.phoneNumber ? ' ' + addStyles.error : '')}
                            required
                        />
                        {formErrors.phoneNumber && (
                            <div className={addStyles.errorMessage}>
                                {formErrors.phoneNumber}
                            </div>
                        )}
                    </div>

                    {/* Status Field */}
                    <div className={addStyles.formGroup}>
                        <label className={addStyles.label}>
                            Status
                        </label>
                        <select
                            name="status"
                            value={form.status}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            className={addStyles.select + (formErrors.status ? ' ' + addStyles.error : '')}
                            aria-label="Status"
                            required
                        >
                            <option value="Online">Online</option>
                            <option value="Offline">Offline</option>
                            <option value="Busy">Busy</option>
                        </select>
                        {formErrors.status && (
                            <div className={addStyles.errorMessage}>
                                {formErrors.status}
                            </div>
                        )}
                    </div>
                </div>

                <div className={addStyles.formActions}>
                    <button
                        type="submit"
                        disabled={creating}
                        className={addStyles.button + ' ' + addStyles.buttonPrimary}
                    >
                        {creating ? (
                            <>
                                <span className={addStyles.buttonIcon}>○</span>
                                Adding...
                            </>
                        ) : (
                            <>
                                <span className={addStyles.buttonIcon}>+</span>
                                Add Doctor
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddNewDoctor;
