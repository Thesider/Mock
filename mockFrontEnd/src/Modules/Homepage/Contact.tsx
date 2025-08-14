import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../assets/Contact.css";

const Contact: React.FC = () => {
  const [isMapZoomed, setIsMapZoomed] = useState(false);

  const handleMapClick = () => {
    setIsMapZoomed(true);
  };

  const handleCloseModal = () => {
    setIsMapZoomed(false);
  };

  return (
    <div className="contact-page">
      <Header />

      <section className="contact-hero">
        <h1>Contact Us</h1>
        <p>We’re here to help. Reach out to us any time.</p>
      </section>

      <section className="contact-content">
        <div className="contact-info">
          <h2>Get In Touch</h2>
          <p>📍 37 Thai Phien, Phuoc Ninh, Hai Chau, Da Nang, Viet Nam</p>
          <p>📞 +84 123 456 789</p>
          <p>
            📧{" "}
            <a href="mailto:support@healthcare.com" className="email-link">
              support@healthcare.com
            </a>
          </p>
        </div>

        <div className="contact-map">
          <h2>Our Location</h2>
          <img
            src="/images/map.png"
            alt="Map of Ngu Hanh Son, Da Nang City, Viet Nam"
            className="map-image"
            onClick={handleMapClick}
          />
        </div>
      </section>

      {isMapZoomed && (
        <div className="map-modal" onClick={handleCloseModal}>
          <div
            className="map-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="map-modal-close" onClick={handleCloseModal}>
              ×
            </button>
            <img
              src="/images/map.png"
              alt="Map of Ngu Hanh Son, Da Nang City, Viet Nam"
              className="map-modal-image"
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Contact;
