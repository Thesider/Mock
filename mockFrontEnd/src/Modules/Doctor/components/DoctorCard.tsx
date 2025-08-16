import React from 'react';
import type { Doctor as DoctorType } from "../../../api/DoctorApi";
import styles from '../styles/DoctorCard.module.css';
interface DoctorCardProps {
    doctor: DoctorType;
    onClick?: () => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onClick }) => {
    return (
        <div className={`${styles.doctorCard} ${styles.fadeIn}`} onClick={onClick}>

            {/* update image later */}
            <h3 className={styles.doctorName}>{doctor.name}</h3>
            <p className={styles.doctorSpecialty}>{doctor.specialty}</p>
            <p className={styles.doctorDepartment}>{doctor.department}</p>
            <p className={styles.doctorAvailability}>
                Available: {doctor.status}
            </p>
        </div>
    );
};

export default DoctorCard;  