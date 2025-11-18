"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthRequest } from "@/hooks/useAuthRequest";
import { USER_ROLES } from "@/constants";
import styles from "../../forms.module.css";
import Header from '@/components/3-organisms/Header';

// -------------------- Types --------------------
interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  phone: string;
}

interface FormErrors {
  email?: string[];
  password?: string[];
  confirmPassword?: string[];
  phone?: string[];
  [key: string]: string[] | undefined;
}

interface ApiError {
  status?: number;
  message?: string;
  data?: {
    errors?: FormErrors;
  };
}

export default function SignUpPage() {
  const [form, setForm] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    role: USER_ROLES.JOB_SEEKER,
    phone: "",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [generalError, setGeneralError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const { register, isLoading } = useAuthRequest();
  const router = useRouter();

  // Handle input changes safely typed
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle submit with proper TS types
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormErrors({});
    setGeneralError("");
    setSuccessMessage("");

    if (form.password !== form.confirmPassword) {
      setFormErrors({ confirmPassword: ["Passwords do not match"] });
      return;
    }

    try {
      await register({
        email: form.email,
        password: form.password,
        phone: form.phone,
        role: form.role,
      });

      setSuccessMessage("Registration successful! Please log in to continue.");

      setTimeout(() => router.push("/auth/login"), 1500);
    } catch (err) {
      const error = err as ApiError;

      if (error.status === 400 && error.data?.errors) {
        setFormErrors(error.data.errors);
      } else {
        setGeneralError(error.message || "An unknown registration error occurred");
      }
    }
  };

  return (
    <>
      <Header />

      <div className={styles.formContainer}>
        <div className={styles.formBox}>
          <h1 className={styles.title}>Create Your Account</h1>

          <form className={styles.form} onSubmit={handleSubmit}>
            {/* Role Selection */}
            <div className={styles.formGroup}>
              <label className={styles.label}>I am a:</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="role"
                    value={USER_ROLES.JOB_SEEKER}
                    checked={form.role === USER_ROLES.JOB_SEEKER}
                    onChange={handleChange}
                    className={styles.radioInput}
                  />
                  Job Seeker
                </label>

                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="role"
                    value={USER_ROLES.JOB_POSTER}
                    checked={form.role === USER_ROLES.JOB_POSTER}
                    onChange={handleChange}
                    className={styles.radioInput}
                  />
                  Job Poster
                </label>
              </div>
            </div>

            {/* Email */}
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className={styles.input}
                value={form.email}
                onChange={handleChange}
                required
              />
              {formErrors.email && (
                <p className={styles.error}>{formErrors.email[0]}</p>
              )}
            </div>

            {/* Password */}
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className={styles.input}
                value={form.password}
                onChange={handleChange}
                required
              />
              {formErrors.password && (
                <p className={styles.error}>{formErrors.password[0]}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className={styles.input}
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
              {formErrors.confirmPassword && (
                <p className={styles.error}>{formErrors.confirmPassword[0]}</p>
              )}
            </div>

            {/* Phone */}
            <div className={styles.formGroup}>
              <label htmlFor="phone" className={styles.label}>
                Phone (Optional)
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className={styles.input}
                value={form.phone}
                onChange={handleChange}
              />
              {formErrors.phone && (
                <p className={styles.error}>{formErrors.phone[0]}</p>
              )}
            </div>

            {/* Errors + Success */}
            {generalError && <p className={styles.error}>{generalError}</p>}
            {successMessage && (
              <p className={styles.success}>{successMessage}</p>
            )}

            {/* Submit */}
            <button type="submit" className={styles.button} disabled={isLoading}>
              {isLoading ? "Registering..." : "Sign Up"}
            </button>
          </form>

          <p className={styles.link}>
            Already have an account? <Link href="/auth/login">Login</Link>
          </p>
        </div>
      </div>
    </>
  );
}
