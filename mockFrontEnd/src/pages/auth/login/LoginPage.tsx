import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css";
import { FaUserMd } from "react-icons/fa";
import { Login, setAuthToken } from "../../../api/LoginApi";
import backgroundImage from "/images/backlogin.png";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string }>({});
  const [success, setSuccess] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateAll = () => {
    const errs: { [k: string]: string } = {};
    if (!username || username.trim().length === 0) errs.username = "Username is required.";
    if (!password || password.length === 0) errs.password = "Password is required.";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFieldErrors({});
    setSuccess(false);

    if (!validateAll()) {
      setLoading(false);
      return;
    }

    try {
      const authResponse = await Login(username, password);

      setAuthToken(authResponse.token);
      localStorage.setItem("refreshToken", authResponse.refreshToken);
      localStorage.setItem("user", JSON.stringify(authResponse.user));

      setSuccess(true);
      setError("");
      setShowToast(true);

      navigate("/");

    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Login failed. Please check your credentials.");
      setSuccess(false);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.root}>
      <div
        className={styles.background}
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className={styles.overlay} />
      <div className={styles.centerContainer}>
        {showToast && (
          <div
            style={{
              position: "fixed",
              top: 24,
              right: 24,
              zIndex: 9999,
              background: success ? "#02aad1" : "#d32f2f",
              color: "#fff",
              padding: "1rem 2rem",
              borderRadius: "10px",
              fontWeight: 600,
              fontSize: "1.08rem",
              boxShadow: "0 4px 16px rgba(2,170,209,0.18)",
              transition: "opacity 0.3s",
            }}
          >
            {success ? "Đăng nhập thành công!" : error}
          </div>
        )}
        <div className={styles.card}>
          <div className={styles.logoBox}>
            <FaUserMd size={48} color="#fff" />
          </div>
          <h2 className={styles.title}>Login</h2>
          <div className={styles.subtitle}>Connecting Doctors & Hospitals</div>
          <form className={styles.form} onSubmit={handleLogin}>
            <div className={styles.formTitle}>User name</div>
            <input
              type="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            {fieldErrors.username && <div className={styles.error}>{fieldErrors.username}</div>}
            <div className={styles.formTitle}>Password</div>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {fieldErrors.password && <div className={styles.error}>{fieldErrors.password}</div>}
            <div className={styles.rememberForgot}>
              <label className={styles.rememberForgotText}>
                <input
                  type="checkbox"
                  style={{ marginRight: 6, width: "fit-content" }}
                />{" "}
                Remember me
              </label>
              <a href="#" className={styles.rememberForgotPassword}>
                Forgot password?
              </a>
            </div>
            <button type="submit" className={styles.loginBtn} disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </button>
            <button type="button" className={styles.googleBtn}>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 48 48"
                  style={{ marginRight: 8 }}
                >
                  <g>
                    <path
                      fill="#4285F4"
                      d="M24 9.5c3.54 0 6.7 1.22 9.19 3.22l6.85-6.85C35.64 2.36 30.13 0 24 0 14.64 0 6.27 5.64 1.98 14.02l8.44 6.56C12.6 14.13 17.87 9.5 24 9.5z"
                    />
                    <path
                      fill="#34A853"
                      d="M46.09 24.56c0-1.64-.15-3.22-.43-4.76H24v9.04h12.44c-.54 2.9-2.17 5.36-4.63 7.04l7.19 5.59C43.73 37.36 46.09 31.44 46.09 24.56z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.42 28.58c-.54-1.62-.85-3.34-.85-5.08s.31-3.46.85-5.08l-8.44-6.56C.64 15.87 0 19.81 0 24c0 4.19.64 8.13 1.98 11.54l8.44-6.56z"
                    />
                    <path
                      fill="#EA4335"
                      d="M24 48c6.13 0 11.64-2.02 15.63-5.5l-7.19-5.59c-2.01 1.35-4.59 2.15-7.44 2.15-6.13 0-11.4-4.63-13.58-10.99l-8.44 6.56C6.27 42.36 14.64 48 24 48z"
                    />
                  </g>
                </svg>
                Login by Google
              </span>
            </button>
            <div className={styles.signupText}>
              Don't have an account?
              <a href="/register" className={styles.signupLink}>
                {" "}
                Sign up here
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
