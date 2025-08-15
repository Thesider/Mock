import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import styles from "../styles/Home.module.css";
import FeaturesSection from "./FeaturesSection";

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
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <h1>The complete enterprise scheduling platform for healthcare</h1>
          <p className={styles.subheading}>Patient Engagement made easy</p>
          <p>
            Working with Hospitals and Clinics we are revolutionising healthcare
            appointments to enable a more efficient patient centered process to
            deliver on growing patient expectations.
          </p>
          <div className={styles.heroButtons}>
            <button className={styles.contactBtn} onClick={handleContactClick}>
              📞 Contact us
            </button>
            <button className={styles.learnBtn} onClick={handleLearnMoreClick}>
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
