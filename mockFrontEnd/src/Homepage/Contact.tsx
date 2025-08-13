import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../assets/Contact.css";

const Contact: React.FC = () => {
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
          <p>📍 Ngu Hanh Son, Da Nang City, Viet Nam</p>
          <p>📞 +84 123 456 789</p>
          <p>📧 support@healthcare.com</p>
        </div>

        <div className="contact-form">
          <h2>Send a Message</h2>
          <form>
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea placeholder="Your Message" required></textarea>
            <button type="submit">Send Message</button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
