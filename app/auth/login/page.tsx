"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthRequest } from "@/hooks/useAuthRequest";
import styles from "../../forms.module.css";
import Header from '@/components/3-organisms/Header';

// -------------------- Types --------------------
interface LoginForm {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string[];
  password?: string[];
  [key: string]: string[] | undefined;
}

interface ApiError {
  status?: number;
  message?: string;
  data?: {
    errors?: FormErrors;
  };
}

export default function LoginPage() {
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [generalError, setGeneralError] = useState<string>("");

  const { login, isLoading } = useAuthRequest();
  const router = useRouter();

  // Typed onChange
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Typed submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setFormErrors({});
    setGeneralError("");

    try {
      await login(form);
      router.push("/jobs");
    } catch (err) {
      const error = err as ApiError;

      if (error.status === 400 && error.data?.errors) {
        setFormErrors(error.data.errors);
      } else {
        setGeneralError(error.message || "An unknown login error occurred");
      }
    }
  };

  return (
    <>
      <Header />

      <div className={styles.formContainer}>
        <div className={styles.formBox}>
          <h1 className={styles.title}>Welcome Back</h1>

          <form className={styles.form} onSubmit={handleSubmit}>
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

            {/* Error */}
            {generalError && <p className={styles.error}>{generalError}</p>}

            {/* Button */}
            <button type="submit" className={styles.button} disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className={styles.link}>
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </>
  );
}
