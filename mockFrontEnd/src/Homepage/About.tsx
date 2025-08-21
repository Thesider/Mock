import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../assets/About.css";

const About: React.FC = () => {
  return (
    <div className="about-page">
      <Header />

      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>About Us</h1>
          <p>
            At Pharmacy, we are committed to transforming the way patients
            access and experience healthcare services.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision">
        <div className="mission">
          <h2>Our Mission</h2>
          <p>
            To provide innovative, reliable, and patient-centered healthcare
            solutions that empower both patients and healthcare providers.
          </p>
        </div>
        <div className="vision">
          <h2>Our Vision</h2>
          <p>
            To be the leading global platform for healthcare scheduling,
            recognized for improving efficiency and patient satisfaction.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="about-content">
        <div className="about-text">
          <h2>Our Story</h2>
          <p>
            Founded in 2020, Pharmacy was born from a simple yet powerful idea:
            to remove the stress, confusion, and inefficiency that patients
            often face when booking healthcare appointments.
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
        <div className="about-image">
          <img src="/images/team.jpg" alt="Our team" />
        </div>
      </section>

      {/* Core Values */}
      <section className="core-values">
        <h2>Our Core Values</h2>
        <div className="values-grid">
          <div className="value-card">
            <h3>Compassion</h3>
            <p>We treat every patient with empathy and understanding.</p>
          </div>
          <div className="value-card">
            <h3>Innovation</h3>
            <p>
              We continuously improve our technology to meet evolving healthcare
              needs.
            </p>
          </div>
          <div className="value-card">
            <h3>Integrity</h3>
            <p>
              We uphold transparency and trust in all our partnerships and
              services.
            </p>
          </div>
          <div className="value-card">
            <h3>Excellence</h3>
            <p>We strive for the highest quality in everything we deliver.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="about-cta">
        <h2>Join Us in Transforming Healthcare</h2>
        <p>
          Whether you’re a patient, provider, or partner, we welcome you to be
          part of the Pharmacy journey.
        </p>
      </section>

      <Footer />
    </div>
  );
};

export default About;
