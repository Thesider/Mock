import React, { useEffect, useState } from "react";
import { getAllDoctors } from "../../../api/DoctorApi";
import type { Doctor as DoctorType } from "../../../api/DoctorApi";
import DoctorGrid from "./DoctorGrid";
import styles from "../styles/Doctor.module.css";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

const DoctorPage: React.FC = () => {
  const [doctors, setDoctors] = useState<DoctorType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDoctors = () => {
    setLoading(true);
    setError(null);
    getAllDoctors()
      .then((res) => {
        setDoctors(res.data);
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

  return (
    <>
      <Header />
      <div className={styles.content}>
        <div>
          <div className={styles.header}>
            <h1 className={styles.headerTitle}>Find a Doctor</h1>
            <p className={styles.headerSubtitle}>
              Browse our qualified medical professionals and find the right
              doctor for your needs
            </p>
          </div>

          <DoctorGrid
            doctors={doctors}
            loading={loading}
            error={error}
            onRetry={fetchDoctors}
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DoctorPage;
