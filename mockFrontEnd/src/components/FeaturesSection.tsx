import React from "react";
import "../assets/FeaturesSection.css";

const features = [
  {
    icon: "📅",
    title: "Online Appointments",
    description:
      "Provide 24/7 visibility of available appointments, allow patients to book their next visit in real time for all ages and technical ranges.",
  },
  {
    icon: "🧩",
    title: "Seamless Integration",
    description:
      "Pharmacy can integrate with your PAS system through our bespoke API and HL7 integration, providing a full end-to-end solution.",
  },
  {
    icon: "👩‍⚕️",
    title: "Clinic Administration",
    description:
      "Pharmacy provides efficient solutions to manage clinic workflows and KPI's built on years of healthcare staff feedback & best practices.",
  },
  {
    icon: "📲",
    title: "Touch Screen Tablet & Kiosk Check In",
    description:
      "Reduce administration and data entry errors through easy-to-use patient self check-in and validation of patient information.",
  },
  {
    icon: "🛡️",
    title: "Fast and Secure",
    description:
      "Keeping your data secure is our top priority. Our hosted centres are certified ISO27001 and comply with NHS Information Governance standards.",
  },
  {
    icon: "📋",
    title: "Patient Results",
    description:
      "Pharmacy provides a market-leading patient portal, where patients can view, reschedule, cancel appointments and view specific results.",
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section id="about-section" className="features-section">
      <h2>See how Pharmacy can improve your clinic today</h2>
      <p className="subtitle">
        Create a seamless and integrated patient pathway experience
      </p>
      <div className="features-grid">
        {features.map((f, index) => (
          <div key={index} className="feature-card">
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
