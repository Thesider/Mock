import React from "react";
import styles from "../styles/Footer.module.css";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* Logo + Mô tả */}
        <div className={styles.footerSection}>
          <img
            src="/images/logo.png"
            alt="Logo"
            className={styles.footerLogo}
          />
          <p className={styles.footerDesc}>
            We offer a quick and convenient medical appointment solution,
            helping to connect patients and health facilities effectively.
          </p>
        </div>

        {/* Liên kết nhanh */}
        <div className={styles.footerSection}>
          <h4>🔗 Quick Links</h4>
          <ul>
            <li>
              <a href="/">🏠 Home</a>
            </li>
            <li>
              <a href="/services">💊 Services</a>
            </li>
            <li>
              <a href="/about">ℹ️ About</a>
            </li>
            <li>
              <a href="/contact">📬 Contact</a>
            </li>
          </ul>
        </div>

        {/* Thông tin liên hệ */}
        <div className={styles.footerSection}>
          <h4>📞 Contact Us</h4>
          <p>📧 Email: support@pharmacy.com</p>
          <p>📱 Phone: +84 123 456 789</p>
          <p>
            📍 Address: 37 Thai Phien, Phuoc Ninh, Hai Chau, Da Nang, Viet Nam
          </p>
        </div>

        {/* Mạng xã hội */}
        <div className={styles.footerSection}>
          <h4>🌐 Follow Us</h4>
          <div className={styles.footerSocials}>
            <a href="#" aria-label="Facebook">
              📘
            </a>
            <a href="#" aria-label="Twitter">
              🐦
            </a>
            <a href="#" aria-label="LinkedIn">
              💼
            </a>
            <a href="#" aria-label="Instagram">
              📸
            </a>
          </div>
        </div>
      </div>

      {/* Bản quyền */}
      <div className={styles.footerBottom}>
        <p>© {new Date().getFullYear()} Pharmacy. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
