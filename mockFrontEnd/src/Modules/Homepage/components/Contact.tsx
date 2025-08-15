import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import styles from "../styles/Contact.module.css";

const Contact: React.FC = () => {
  const [isMapZoomed, setIsMapZoomed] = useState(false);

  // Scroll lên đầu khi load trang
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.contactPage}>
      <Header />

      {/* Hero Section */}
      <section className={styles.contactHero}>
        <h1>Contact Us</h1>
        <p>We’re here to help. Reach out to us any time.</p>
      </section>

      {/* Contact Info */}
      <section className={styles.contactContent}>
        <div className={styles.contactInfo}>
          <h2>Get In Touch</h2>
          <p>📍 37 Thai Phien, Phuoc Ninh, Hai Chau, Da Nang, Viet Nam</p>
          <p>📞 +84 123 456 789</p>
          <p>
            📧{" "}
            <a
              href="mailto:support@healthcare.com"
              className={styles.emailLink}
            >
              support@healthcare.com
            </a>
          </p>
        </div>

        {/* Map Section */}
        <div className={styles.mapSection}>
          <h2>Our Location</h2>
          <p>
            We offer a quick and convenient medical appointment solution,
            helping to connect patients and health facilities effectively.
          </p>
          <div
            className={styles.mapContainer}
            style={{ cursor: "zoom-in" }}
            onClick={() => setIsMapZoomed(true)}
          >
            <img
              src="/images/map.png"
              alt="Map location"
              className={styles.mapImage}
            />
          </div>
        </div>
      </section>

      {/* Modal Zoom Map */}
      {isMapZoomed && (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsMapZoomed(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()} // tránh đóng khi click vào ảnh
          >
            <img
              src="/images/map.png"
              alt="Zoomed map"
              className={styles.zoomedMap}
            />
            <button
              className={styles.closeBtn}
              onClick={() => setIsMapZoomed(false)}
            >
              ✖
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Contact;
