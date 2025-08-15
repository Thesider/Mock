import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import styles from "../styles/About.module.css";

const About: React.FC = () => {
  const navigate = useNavigate();

  const doctors = [
    {
      name: "Dr. Nguyễn Văn A",
      title: "Chuyên khoa Tim mạch",
      achievements: "20+ năm kinh nghiệm, tác giả 15 nghiên cứu khoa học",
      image: "/images/doctor1.jpg",
    },
    {
      name: "Dr. Trần Thị B",
      title: "Chuyên khoa Nhi",
      achievements: "Thành viên Hội Y học Quốc tế, giảng viên ĐH Y Hà Nội",
      image: "/images/doctor2.jpg",
    },
    {
      name: "Dr. Lê Văn C",
      title: "Chuyên khoa Ngoại",
      achievements: "Thực hiện hơn 500 ca phẫu thuật thành công",
      image: "/images/doctor3.jpg",
    },
  ];

  return (
    <div className={styles.aboutPage}>
      <Header />

      {/* Hero Section */}
      <section className={styles.aboutHero}>
        <div>
          <h1>About Us</h1>
          <p>
            At Pharmacy, we are committed to transforming the way patients
            access and experience healthcare services.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className={styles.missionVision}>
        <div className={styles.mission}>
          <h2>Our Mission</h2>
          <p>
            To provide innovative, reliable, and patient-centered healthcare
            solutions that empower both patients and healthcare providers.
          </p>
        </div>
        <div className={styles.vision}>
          <h2>Our Vision</h2>
          <p>
            To be the leading global platform for healthcare scheduling,
            recognized for improving efficiency and patient satisfaction.
          </p>
        </div>
      </section>

      {/* Featured Doctors */}
      <section className={styles.featuredDoctors}>
        <h2>OUR FEATURED DOCTORS</h2>
        <div className={styles.doctorGrid}>
          {doctors.map((doc, index) => (
            <div className={styles.doctorCard} key={index}>
              <img
                src={doc.image}
                alt={doc.name}
                className={styles.doctorImage}
              />
              <h3>{doc.name}</h3>
              <p className={styles.doctorTitle}>{doc.title}</p>
              <p className={styles.doctorAchievements}>{doc.achievements}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Story */}
      <section className={styles.aboutContent}>
        <div className={styles.aboutText}>
          <h2>Our Story</h2>
          <p>
            Founded in 2020, Swiftqueue was born from a simple yet powerful
            idea: to remove the stress, confusion, and inefficiency that
            patients often face when booking healthcare appointments.
          </p>
          <p>
            Our founders saw how long waiting times, missed appointments, and
            poor communication could lead to frustration for patients and
            providers alike. They envisioned a solution where technology could
            bridge the gap — making healthcare more human, not less.
          </p>
          <p>
            From a small startup with a handful of passionate innovators, we
            have grown into a trusted partner for hospitals, clinics, and
            healthcare organizations worldwide. Today, our platform supports
            millions of appointments annually, helping providers streamline
            operations and patients get the care they need — when they need it.
          </p>
          <p>
            As we look to the future, our mission remains unchanged: to ensure
            that every interaction between patient and provider is as smooth,
            transparent, and compassionate as possible.
          </p>
        </div>
        <div className={styles.aboutImage}>
          <img src="/images/team.jpg" alt="Our team" />
        </div>
      </section>

      {/* Core Values */}
      <section className={styles.coreValues}>
        <h2>Our Core Values</h2>
        <div className={styles.valuesGrid}>
          <div className={styles.valueCard}>
            <h3>Compassion</h3>
            <p>We treat every patient with empathy and understanding.</p>
          </div>
          <div className={styles.valueCard}>
            <h3>Innovation</h3>
            <p>
              We continuously improve our technology to meet evolving healthcare
              needs.
            </p>
          </div>
          <div className={styles.valueCard}>
            <h3>Integrity</h3>
            <p>
              We uphold transparency and trust in all our partnerships and
              services.
            </p>
          </div>
          <div className={styles.valueCard}>
            <h3>Excellence</h3>
            <p>We strive for the highest quality in everything we deliver.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className={styles.aboutCta}>
        <h2>Join Us in Transforming Healthcare</h2>
        <p>
          Whether you’re a patient, provider, or partner, we welcome you to be
          part of the Pharmacy journey.
        </p>
        <button
          className={styles.contactBtn}
          onClick={() => navigate("/contact")}
        >
          Get in Touch
        </button>
      </section>

      <Footer />
    </div>
  );
};

export default About;
