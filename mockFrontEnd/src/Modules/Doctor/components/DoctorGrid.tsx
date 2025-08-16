import React, { useState, useCallback } from "react";
import type { Doctor as DoctorType } from "../../../api/DoctorApi";
import styles from "../styles/DoctorGrid.module.css";

interface DoctorGridProps {
  doctors: DoctorType[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const DoctorGrid: React.FC<DoctorGridProps> = ({
  doctors,
  loading = false,
  error = null,
  onRetry,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");

  // Get unique specialties for filter dropdown
  const specialties = Array.from(new Set(doctors.map(doctor => doctor.specialty)));

  // Filter doctors based on search and specialty
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = searchQuery === "" ||
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSpecialty = selectedSpecialty === "" ||
      doctor.specialty === selectedSpecialty;

    return matchesSearch && matchesSpecialty;
  });

  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedSpecialty("");
  }, []);

  const getAvailabilityText = (status: string) => {
    switch (status) {
      case "Online":
        return "Available now";
      case "Busy":
        return "Busy - Limited availability";
      case "Offline":
        return "Currently offline";
      default:
        return "Status unknown";
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className={styles.stateContainer}>
          <div className={styles.loadingSpinner}></div>
          <p className={styles.stateText}>Loading doctors...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className={styles.stateContainer}>
          <div className={styles.errorIcon}>⚠️</div>
          <h3 className={styles.stateTitle}>Error Loading Doctors</h3>
          <p className={styles.stateText}>{error}</p>
          {onRetry && (
            <button onClick={onRetry} className={styles.retryButton}>
              Try Again
            </button>
          )}
        </div>
      );
    }

    if (filteredDoctors.length === 0) {
      return (
        <div className={styles.stateContainer}>
          <div className={styles.emptyIcon}>👨‍⚕️</div>
          <h3 className={styles.stateTitle}>
            {searchQuery || selectedSpecialty ? "No doctors found" : "No doctors available"}
          </h3>
          <p className={styles.stateText}>
            {searchQuery || selectedSpecialty
              ? "Try adjusting your search criteria or filters."
              : "There are currently no doctors in the system."}
          </p>
          {(searchQuery || selectedSpecialty) && (
            <button onClick={handleClearFilters} className={styles.clearButton}>
              Clear Filters
            </button>
          )}
        </div>
      );
    }

    return (
      <div className={styles.grid}>
        {filteredDoctors.map((doctor) => (
          <div key={doctor.id} className={styles.cardWrapper}>
            <div className={styles.doctorCard}>
              {/* Avatar placeholder with initials */}
              <div className={styles.avatar}>
                <span className={styles.initials}>
                  {doctor.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>

              {/* Doctor information */}
              <div className={styles.doctorInfo}>
                <h3 className={styles.doctorName}>{doctor.name}</h3>
                <p className={styles.doctorSpecialty}>{doctor.specialty}</p>
                <p className={styles.doctorDepartment}>{doctor.department}</p>
                <div className={styles.availability}>
                  <span className={`${styles.statusDot} ${styles[`status${doctor.status}`]}`}></span>
                  {getAvailabilityText(doctor.status)}
                </div>
                <div className={styles.contactInfo}>
                  <span className={styles.phoneNumber}>📞 {doctor.phoneNumber}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* Search and Filter Section */}
      <div className={styles.searchSection}>
        <div className={styles.searchContainer}>
          <div className={styles.searchInputWrapper}>
            <input
              type="text"
              placeholder="Search doctors by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
              disabled={loading}
            />
            <span className={styles.searchIcon}>🔍</span>
          </div>

          <select
            aria-label="Filter by specialty"
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className={styles.specialtyFilter}
            disabled={loading}
          >
            <option value="">All Specializations</option>
            {specialties.map((specialty) => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>
        </div>

        {/* Results count */}
        {!loading && !error && (
          <div className={styles.resultsInfo}>
            <span className={styles.resultsCount}>
              {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''} found
            </span>
            {(searchQuery || selectedSpecialty) && (
              <button onClick={handleClearFilters} className={styles.clearFiltersButton}>
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className={styles.content}>
        {renderContent()}
      </div>
    </div>
  );
};

export default DoctorGrid;
