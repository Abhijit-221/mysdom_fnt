import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import "./forgotPassword.css";

const STEPS = { EMAIL: 1, OTP: 2, RESET: 3, SUCCESS: 4 };
const OTP_LENGTH = 6;
const OTP_TIMER = 60;

function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(STEPS.EMAIL);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(OTP_TIMER);
  const [canResend, setCanResend] = useState(false);

  const otpRefs = useRef([]);
  const timerRef = useRef(null);

  // ── Timer for OTP resend ──────────────────────────────────
  useEffect(() => {
    if (step === STEPS.OTP) startTimer();
    return () => clearInterval(timerRef.current);
  }, [step]);

  const startTimer = () => {
    setTimer(OTP_TIMER);
    setCanResend(false);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const clearError = () => setError("");

  // ── OTP input handling ────────────────────────────────────
  const handleOtpChange = (index, e) => {
    const val = e.target.value.replace(/\D/, "");
    if (!val) return;
    const updated = [...otp];
    updated[index] = val.slice(-1);
    setOtp(updated);
    if (index < OTP_LENGTH - 1) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      const updated = [...otp];
      if (updated[index]) {
        updated[index] = "";
        setOtp(updated);
      } else if (index > 0) {
        otpRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      otpRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    const updated = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((char, i) => { updated[i] = char; });
    setOtp(updated);
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    otpRefs.current[focusIndex]?.focus();
  };

  // ── Validations ───────────────────────────────────────────
  const validateEmail = () => {
    if (!email.trim()) { setError("Email address is required"); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Enter a valid email address"); return false; }
    return true;
  };

  const validateOtp = () => {
    if (otp.some((d) => !d)) { setError("Please enter all 6 digits"); return false; }
    return true;
  };

  const validatePassword = () => {
    if (!newPassword) { setError("New password is required"); return false; }
    if (newPassword.length < 8) { setError("Password must be at least 8 characters"); return false; }
    if (!/[A-Z]/.test(newPassword)) { setError("Password must contain at least one uppercase letter"); return false; }
    if (!/[0-9]/.test(newPassword)) { setError("Password must contain at least one number"); return false; }
    if (newPassword !== confirmPassword) { setError("Passwords do not match"); return false; }
    return true;
  };

  const passwordStrength = () => {
    if (!newPassword) return { level: 0, label: "", color: "" };
    let score = 0;
    if (newPassword.length >= 8) score++;
    if (/[A-Z]/.test(newPassword)) score++;
    if (/[0-9]/.test(newPassword)) score++;
    if (/[^A-Za-z0-9]/.test(newPassword)) score++;
    if (score <= 1) return { level: 1, label: "Weak", color: "#e8445a" };
    if (score === 2) return { level: 2, label: "Fair", color: "#f59e0b" };
    if (score === 3) return { level: 3, label: "Good", color: "#3b82f6" };
    return { level: 4, label: "Strong", color: "#10b981" };
  };

  // ── API calls ─────────────────────────────────────────────
  const handleSendOtp = async () => {
    if (!validateEmail()) return;
    clearError();
    setLoading(true);
    try {
      await axiosInstance.post("/auth/forgot-send-otp", { email });
      setStep(STEPS.OTP);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!validateOtp()) return;
    clearError();
    setLoading(true);
    try {
      await axiosInstance.post("/auth/verify-otp", { email, otp: otp.join("") });
      setStep(STEPS.RESET);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
      setOtp(Array(OTP_LENGTH).fill(""));
      otpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    clearError();
    setLoading(true);
    try {
      await axiosInstance.post("/auth/forgot-send-otp", { email });
      setOtp(Array(OTP_LENGTH).fill(""));
      otpRefs.current[0]?.focus();
      startTimer();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!validatePassword()) return;
    clearError();
    setLoading(true);
    try {
      await axiosInstance.post("/auth/reset-password", {
        email,
        otp: otp.join(""),
        newPassword,
      });
      setStep(STEPS.SUCCESS);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const strength = passwordStrength();

  return (
    <div className="fp-page">

      {/* Background decorative shapes */}
      <div className="fp-bg-shape fp-shape-1" />
      <div className="fp-bg-shape fp-shape-2" />
      <div className="fp-bg-shape fp-shape-3" />

      <div className="fp-card">

        {/* Progress dots */}
        {step !== STEPS.SUCCESS && (
          <div className="fp-progress">
            {[STEPS.EMAIL, STEPS.OTP, STEPS.RESET].map((s) => (
              <div key={s} className={`fp-dot ${step >= s ? "fp-dot--active" : ""} ${step > s ? "fp-dot--done" : ""}`}>
                {step > s ? (
                  <svg viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : s}
              </div>
            ))}
            <div className="fp-progress-line">
              <div className="fp-progress-fill" style={{ width: `${((step - 1) / 2) * 100}%` }} />
            </div>
          </div>
        )}

        {/* ── STEP 1: EMAIL ── */}
        {step === STEPS.EMAIL && (
          <div className="fp-body fp-animate">
            <div className="fp-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="4" width="20" height="16" rx="3" />
                <path d="M2 8l10 6 10-6" />
              </svg>
            </div>
            <h2 className="fp-title">Forgot Password?</h2>
            <p className="fp-subtitle">Enter your registered email and we'll send you a verification code.</p>

            {error && <div className="fp-error">{error}</div>}

            <div className="fp-field">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearError(); }}
                onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                autoFocus
              />
            </div>

            <button className="fp-btn fp-btn--primary" onClick={handleSendOtp} disabled={loading}>
              {loading ? <span className="fp-spinner" /> : "Send Verification Code"}
            </button>

            <button className="fp-btn fp-btn--ghost" onClick={() => navigate("/login")}>
              ← Back to Login
            </button>
          </div>
        )}

        {/* ── STEP 2: OTP ── */}
        {step === STEPS.OTP && (
          <div className="fp-body fp-animate">
            <div className="fp-icon-wrap fp-icon-wrap--otp">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="5" y="11" width="14" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 018 0v4" />
                <circle cx="12" cy="16" r="1" fill="currentColor" />
              </svg>
            </div>
            <h2 className="fp-title">Verify Your Email</h2>
            <p className="fp-subtitle">
              We sent a 6-digit code to <strong>{email}</strong>
            </p>

            {error && <div className="fp-error">{error}</div>}

            <div className="fp-otp-row" onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (otpRefs.current[i] = el)}
                  className={`fp-otp-box ${digit ? "fp-otp-box--filled" : ""}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  autoFocus={i === 0}
                />
              ))}
            </div>

            <div className="fp-resend">
              {canResend ? (
                <button className="fp-resend-btn" onClick={handleResendOtp} disabled={loading}>
                  Resend Code
                </button>
              ) : (
                <span>Resend code in <strong>{timer}s</strong></span>
              )}
            </div>

            <button
              className="fp-btn fp-btn--primary"
              onClick={handleVerifyOtp}
              disabled={loading || otp.some((d) => !d)}
            >
              {loading ? <span className="fp-spinner" /> : "Verify Code"}
            </button>

            <button className="fp-btn fp-btn--ghost" onClick={() => { setStep(STEPS.EMAIL); clearError(); }}>
              ← Change Email
            </button>
          </div>
        )}

        {/* ── STEP 3: RESET PASSWORD ── */}
        {step === STEPS.RESET && (
          <div className="fp-body fp-animate">
            <div className="fp-icon-wrap fp-icon-wrap--reset">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2a5 5 0 015 5v1H7V7a5 5 0 015-5z" />
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M12 15v3" strokeLinecap="round" />
              </svg>
            </div>
            <h2 className="fp-title">Set New Password</h2>
            <p className="fp-subtitle">Choose a strong password you haven't used before.</p>

            {error && <div className="fp-error">{error}</div>}

            <div className="fp-field">
              <label>New Password</label>
              <div className="fp-input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); clearError(); }}
                  autoFocus
                />
                <button className="fp-eye" onClick={() => setShowPassword((p) => !p)} type="button">
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M17.94 17.94A10.9 10.9 0 0112 20C7 20 2.73 16.11 1 12c.75-1.81 1.93-3.41 3.38-4.7M9.9 9.9A3 3 0 0114.1 14.1M3 3l18 18" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Strength bar */}
              {newPassword && (
                <div className="fp-strength">
                  <div className="fp-strength-bars">
                    {[1, 2, 3, 4].map((lvl) => (
                      <div
                        key={lvl}
                        className="fp-strength-bar"
                        style={{ background: lvl <= strength.level ? strength.color : "var(--fp-border)" }}
                      />
                    ))}
                  </div>
                  <span style={{ color: strength.color }}>{strength.label}</span>
                </div>
              )}
            </div>

            <div className="fp-field">
              <label>Confirm Password</label>
              <div className="fp-input-wrap">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); clearError(); }}
                  onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
                />
                <button className="fp-eye" onClick={() => setShowConfirm((p) => !p)} type="button">
                  {showConfirm ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M17.94 17.94A10.9 10.9 0 0112 20C7 20 2.73 16.11 1 12c.75-1.81 1.93-3.41 3.38-4.7M9.9 9.9A3 3 0 0114.1 14.1M3 3l18 18" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button className="fp-btn fp-btn--primary" onClick={handleResetPassword} disabled={loading}>
              {loading ? <span className="fp-spinner" /> : "Reset Password"}
            </button>
          </div>
        )}

        {/* ── STEP 4: SUCCESS ── */}
        {step === STEPS.SUCCESS && (
          <div className="fp-body fp-animate fp-success-body">
            <div className="fp-success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M7 12l3.5 3.5L17 8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="fp-title">Password Reset!</h2>
            <p className="fp-subtitle">Your password has been updated successfully. You can now log in with your new password.</p>
            <button className="fp-btn fp-btn--primary" onClick={() => navigate("/login")}>
              Go to Login
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default ForgotPassword;