import React from "react";
import styles from "../styles/FeaturesSection.module.css";

const features = [
  {
    icon: "📅",
    title: "Online Appointments",
    description:
      "Easily book appointments 24/7 with real-time visibility of available slots, suitable for patients of all ages and technical abilities.",
  },
  {
    icon: "🧩",
    title: "Seamless Booking Experience",
    description:
      "Our platform ensures a smooth and intuitive booking process, guiding patients to select the right time and doctor effortlessly.",
  },
  {
    icon: "👩‍⚕️",
    title: "Doctor Availability",
    description:
      "View real-time schedules of doctors and book appointments with your preferred healthcare provider quickly and easily.",
  },
  {
    icon: "📲",
    title: "Mobile-Friendly Booking",
    description:
      "Book appointments on the go using our mobile-optimized platform, ensuring convenience and accessibility anywhere, anytime.",
  },
  {
    icon: "🛡️",
    title: "Fast and Secure",
    description:
      "Your booking data is protected with top-tier security measures, ensuring a fast and safe appointment scheduling experience.",
  },
  {
    icon: "📋",
    title: "Appointment Management",
    description:
      "Easily manage your appointments, including rescheduling or canceling, through our user-friendly booking interface.",
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section id="about-section" className={styles.featuresSection}>
      <h2>Discover how our platform simplifies appointment booking</h2>
      <p className={styles.subtitle}>
        Enjoy a seamless and efficient booking experience tailored for patients
      </p>
      <div className={styles.featuresGrid}>
        {features.map((f, index) => (
          <div key={index} className={styles.featureCard}>
            <div className={styles.featureIcon}>{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
