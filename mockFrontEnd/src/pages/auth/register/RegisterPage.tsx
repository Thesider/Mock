import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./RegisterPage.module.css";
import { FaUserMd } from "react-icons/fa";
import { Register, setAuthToken } from "../../../api/LoginApi";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const role = "User";
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string; confirmPassword?: string }>({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateAll = () => {
    const errs: { [k: string]: string } = {};
    if (!username || username.trim().length < 3) errs.username = "Username must be at least 3 characters.";
    if (!password || password.length < 6) errs.password = "Password must be at least 6 characters.";
    if (password !== confirmPassword) errs.confirmPassword = "Passwords do not match.";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    setFieldErrors({});

    if (!validateAll()) {
      setLoading(false);
      return;
    }

    try {
      const authResponse = await Register(username, password, confirmPassword, role);

      setAuthToken(authResponse.token);
      localStorage.setItem("refreshToken", authResponse.refreshToken);
      localStorage.setItem("user", JSON.stringify(authResponse.user));

      setSuccess(true);
      setError("");

      navigate("/profile", { state: { new: true, user: authResponse.user } });

    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "Registration failed. Please try again.");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
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
            Create your patient account
          </div>
          <form className={styles.form} onSubmit={handleRegister}>
            <div className={styles.formTitle}>Username</div>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
            />
            {fieldErrors.username && <div className={styles.error}>{fieldErrors.username}</div>}

            <div className={styles.formTitle}>Password</div>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            {fieldErrors.password && <div className={styles.error}>{fieldErrors.password}</div>}
            <div className={styles.formTitle}>Confirm Password</div>
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
            {fieldErrors.confirmPassword && <div className={styles.error}>{fieldErrors.confirmPassword}</div>}
            {error && <div className={styles.error}>{error}</div>}
            {success && (
              <div className={styles.success}>Registration successful! Redirecting...</div>
            )}
            <button type="submit" className={styles.registerBtn} disabled={loading}>
              {loading ? "Registering..." : "Register"}
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
