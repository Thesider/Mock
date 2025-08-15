import React, { useEffect, useState, useCallback } from 'react';
import { getAllDoctors } from '../../../api/DoctorApi';
import type { Doctor as DoctorType } from '../../../api/DoctorApi';
import SearchDoctor from './SearchDoctor';
import AddNewDoctor from './AddNewDoctor';
import DoctorList from './DoctorList';
import '../doctor.module.css';

const DoctorPage: React.FC = () => {
    const [doctors, setDoctors] = useState<DoctorType[]>([]);
    const [allDoctors, setAllDoctors] = useState<DoctorType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [currentSearchQuery, setCurrentSearchQuery] = useState('');

    // Safe string helper for null/undefined values
    const safeString = (value: any): string => {
        return value?.toString()?.toLowerCase() || '';
    };

    const fetchDoctors = () => {
        setLoading(true);
        setError(null);
        getAllDoctors()
            .then(res => {
                setDoctors(res.data);
                setAllDoctors(res.data);
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to fetch doctors');
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    // Search functionality with null safety
    const handleSearch = useCallback(async (query: string, field: string) => {
        setCurrentSearchQuery(query);

        if (!query.trim()) {
            setDoctors(allDoctors);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);

        try {
            if (field === 'all') {
                // Search across all fields with null safety
                const filtered = allDoctors.filter(doctor =>
                    safeString(doctor.name).includes(query.toLowerCase()) ||
                    safeString(doctor.specialty).includes(query.toLowerCase()) ||
                    safeString(doctor.department).includes(query.toLowerCase()) ||
                    safeString(doctor.status).includes(query.toLowerCase())
                );
                setDoctors(filtered);
            } else if (field === 'status') {
                // Handle status search specially
                const filtered = allDoctors.filter(doctor =>
                    safeString(doctor.status).includes(query.toLowerCase())
                );
                setDoctors(filtered);
            } else {
                // Search specific field with null safety
                const filtered = allDoctors.filter(doctor => {
                    const fieldValue = safeString(doctor[field as keyof DoctorType]);
                    return fieldValue.includes(query.toLowerCase());
                });
                setDoctors(filtered);
            }
        } catch (error) {
            console.error('Search error:', error);
            setError('Failed to search doctors');
        } finally {
            setIsSearching(false);
        }
    }, [allDoctors]);

    const handleClearSearch = () => {
        setCurrentSearchQuery('');
        setDoctors(allDoctors);
        setIsSearching(false);
    };

    const handleDoctorAdded = () => {
        setShowAddForm(false);
        fetchDoctors();
    };

    const handleDoctorUpdated = () => {
        fetchDoctors();
    };

    const handleError = (errorMessage: string) => {
        setError(errorMessage);
    };

    if (loading) {
        return (
            <div className="loadingContainer">
                <div className="loadingContent">
                    <div className="loadingText">
                        Loading doctors...
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="errorContainer">
                <div className="errorContent">
                    <div className="errorTitle">
                        Error
                    </div>
                    <p className="errorMessage">{error}</p>
                    <button
                        type="button"
                        onClick={fetchDoctors}
                        className="button buttonPrimary"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="wrapper">
                {/* Header */}
                <div className="header">
                    <h1 className="headerTitle">
                        Doctor Management
                    </h1>
                    <p className="headerSubtitle">Manage hospital doctors and their information</p>
                </div>

                {/* Search Component */}
                <SearchDoctor
                    onSearch={handleSearch}
                    onClear={handleClearSearch}
                    isSearching={isSearching}
                />

                {/* Add Doctor Form */}
                {!showAddForm ? (
                    <div className="addDoctorTrigger">
                        <button
                            type="button"
                            onClick={() => setShowAddForm(true)}
                            className="button buttonPrimary addDoctorButton"
                        >
                            <span className="buttonIcon">+</span>
                            Add New Doctor
                        </button>
                    </div>
                ) : (
                    <AddNewDoctor
                        onDoctorAdded={handleDoctorAdded}
                        onCancel={() => setShowAddForm(false)}
                        onError={handleError}
                    />
                )}

                {/* Doctor List */}
                <DoctorList
                    doctors={doctors}
                    onDoctorUpdated={handleDoctorUpdated}
                    onError={handleError}
                    searchQuery={currentSearchQuery}
                    onClearSearch={handleClearSearch}
                />
            </div>
        </div>
    );
};

export default DoctorPage;
