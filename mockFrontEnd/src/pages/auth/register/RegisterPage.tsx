import React, { useState } from "react";
import styles from "./RegisterPage.module.css";
import { FaUserMd } from "react-icons/fa";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setSuccess(false);
      return;
    }
    if (!email || !password) {
      setError("Please fill all fields.");
      setSuccess(false);
      return;
    }
    setSuccess(true);
    setError("");
  };

  return (
    <div className={styles.root}>
      <div className={styles.background} />
      <div className={styles.overlay} />
      <div className={styles.centerContainer}>
        <div className={styles.card}>
          <div className={styles.logoBox}>
            <FaUserMd size={48} color="#fff" />
          </div>
          <h2 className={styles.title}>Register</h2>
          <div className={styles.subtitle}>
            Join our hospital doctor network
          </div>
          <form className={styles.form} onSubmit={handleRegister}>
            <div className={styles.formTitle}>Email Address</div>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className={styles.formTitle}>Password</div>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className={styles.formTitle}>Confirm Password</div>
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {error && <div className={styles.error}>{error}</div>}
            {success && (
              <div className={styles.success}>Registration successful!</div>
            )}
            <button type="submit" className={styles.registerBtn}>
              Register
            </button>
            <div className={styles.signupText}>
              Have an account?
              <a href="/login" className={styles.signupLink}>
                Log in now
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
