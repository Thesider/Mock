import React from "react";
import "../assets/Footer.css";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo + Mô tả */}
        <div className="footer-section">
          <img src="/images/logo.png" alt="Logo" className="footer-logo" />
          <p className="footer-desc">
            We offer a quick and convenient medical appointment solution,
            helping to connect patients and health facilities effectively.
          </p>
        </div>

        {/* Liên kết nhanh */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/book-appointment">Services</a>
            </li>
            <li>
              <a href="/about">About</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
          </ul>
        </div>

        {/* Thông tin liên hệ */}
        <div className="footer-section">
          <h4>Contact Us</h4>
          <p>Email: support@pharmacy.com</p>
          <p>Phone: +84 123 456 789</p>
          <p>Address: 37 Thai Phien, Phuoc Ninh, Hai Chau, Da Nang, Viet Nam</p>
        </div>

        {/* Mạng xã hội */}
        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="footer-socials">
            <a href="https://www.facebook.com/">
              <FaFacebookF />
            </a>
            <a href="https://x.com/">
              <FaTwitter />
            </a>
            <a href="https://www.linkedin.com/">
              <FaLinkedinIn />
            </a>
            <a href="https://www.instagram.com/">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      {/* Bản quyền */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Pharmacy. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
