import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../assets/Home.css";
import FeaturesSection from "../components/FeaturesSection";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleContactClick = () => {
    navigate("/contact");
  };

  const handleLearnMoreClick = () => {
    const section = document.getElementById("about-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <Header />
      <section className="hero">
        <div className="hero-left">
          <h1>The complete enterprise scheduling platform for healthcare</h1>
          <p className="subheading">Patient Engagement made easy</p>
          <p>
            Working with Hospitals and Clinics we are revolutionising healthcare
            appointments to enable a more efficient patient centered process to
            deliver on growing patient expectations.
          </p>
          <div className="hero-buttons">
            <button className="contact-btn" onClick={handleContactClick}>
              Contact us
            </button>
            <button className="learn-btn" onClick={handleLearnMoreClick}>
              Learn More ▼
            </button>
          </div>
        </div>
      </section>

      <FeaturesSection />

      <Footer />
    </>
  );
};

export default HomePage;
