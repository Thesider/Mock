import React, { useEffect, useState, useCallback } from "react";
import { getAllDoctors } from "../../../api/DoctorApi";
import type { Doctor as DoctorType } from "../../../api/DoctorApi";
import SearchDoctor from "./SearchDoctor";
import DoctorList from "./DoctorList";
import styles from "../styles/Doctor.module.css";
import Header from "../../Homepage/components/Header";
import Footer from "../../Homepage/components/Footer";

const DoctorPage: React.FC = () => {
  const [doctors, setDoctors] = useState<DoctorType[]>([]);
  const [allDoctors, setAllDoctors] = useState<DoctorType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [currentSearchQuery, setCurrentSearchQuery] = useState("");

  const safeString = (value: any): string =>
    value?.toString()?.toLowerCase() || "";

  const fetchDoctors = () => {
    setLoading(true);
    setError(null);
    getAllDoctors()
      .then((res) => {
        setDoctors(res.data);
        setAllDoctors(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch doctors");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleSearch = useCallback(
    async (query: string, field: string) => {
      setCurrentSearchQuery(query);

      if (!query.trim()) {
        setDoctors(allDoctors);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);

      try {
        if (field === "all") {
          const filtered = allDoctors.filter(
            (doctor) =>
              safeString(doctor.name).includes(query.toLowerCase()) ||
              safeString(doctor.specialty).includes(query.toLowerCase()) ||
              safeString(doctor.department).includes(query.toLowerCase()) ||
              safeString(doctor.status).includes(query.toLowerCase())
          );
          setDoctors(filtered);
        } else if (field === "status") {
          const filtered = allDoctors.filter((doctor) =>
            safeString(doctor.status).includes(query.toLowerCase())
          );
          setDoctors(filtered);
        } else {
          const filtered = allDoctors.filter((doctor) => {
            const fieldValue = safeString(doctor[field as keyof DoctorType]);
            return fieldValue.includes(query.toLowerCase());
          });
          setDoctors(filtered);
        }
      } catch (error) {
        console.error("Search error:", error);
        setError("Failed to search doctors");
      } finally {
        setIsSearching(false);
      }
    },
    [allDoctors]
  );

  const handleClearSearch = () => {
    setCurrentSearchQuery("");
    setDoctors(allDoctors);
    setIsSearching(false);
  };

  const handleDoctorUpdated = () => {
    fetchDoctors();
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <>
      <Header /> {/* Header luôn hiển thị, tự xử lý chiều rộng */}
      <div className={styles.content}>
        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingContent}>
              <div className={styles.loadingText}>Loading doctors...</div>
            </div>
          </div>
        ) : error ? (
          <div className={styles.errorContainer}>
            <div className={styles.errorContent}>
              <div className={styles.errorTitle}>Error</div>
              <p className={styles.errorMessage}>{error}</p>
              <button
                type="button"
                onClick={fetchDoctors}
                className={`${styles.button} ${styles.buttonPrimary}`}
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className={styles.header}>
              <h1 className={styles.headerTitle}>Doctor Management</h1>
              <p className={styles.headerSubtitle}>
                Manage hospital doctors and their information
              </p>
            </div>

            <SearchDoctor
              onSearch={handleSearch}
              onClear={handleClearSearch}
              isSearching={isSearching}
            />

            <DoctorList
              doctors={doctors}
              onDoctorUpdated={handleDoctorUpdated}
              onError={handleError}
              searchQuery={currentSearchQuery}
              onClearSearch={handleClearSearch}
            />
          </div>
        )}
      </div>
      <Footer /> {/* Footer luôn hiển thị, tự xử lý chiều rộng */}
    </>
  );
};

export default DoctorPage;
