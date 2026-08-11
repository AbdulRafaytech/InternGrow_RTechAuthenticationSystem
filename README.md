# RTech — Authentication Module

Task 1 (Week 1) of the InternGrow Frontend Development Track: a complete authentication
module built with React.

There is no real backend — auth is simulated with `localStorage` inside
`src/context/AuthContext.jsx`, so every screen actually works end-to-end without needing
a server. OTP codes are UI-only (demo code: `1234`) since the task asks for the
**verification interface**, not real email/SMS delivery — that would be a backend's job.

## Features (matches every task requirement)

| Requirement | Where |
|---|---|
| Login | `src/pages/Login.jsx` |
| Register | `src/pages/Register.jsx` |
| Email Verification Screen | `src/pages/EmailVerification.jsx` |
| Forgot Password | `src/pages/ForgotPassword.jsx` |
| Reset Password | `src/pages/ResetPassword.jsx` |
| OTP Verification UI | `src/pages/OtpVerification.jsx` |
| Password Strength Meter | `src/components/PasswordStrengthMeter.jsx` |
| Remember Me | checkbox in `Login.jsx`, logic in `AuthContext.jsx` |
| Protected Routes | `src/components/ProtectedRoute.jsx` guarding `/dashboard` |
| Session Timeout UI | `src/components/SessionTimeoutModal.jsx` |

Concepts used: React Router, controlled form validation, reusable components, Context
API for state management.

## Run it locally

```bash
npm install
npm run dev
```

Open the URL it prints (usually `http://localhost:5173`).

## Try the full flow

1. Go to **Register**, create an account.
2. On **Email Verification**, click "Simulate clicking email link" (stands in for the
   real email link a backend would send).
3. Log in with the same email/password.
4. On the **Dashboard**, stay idle for 60 seconds → a **session timeout** modal appears
   with a 15s countdown.
5. To test **Forgot/Reset Password**: from Login, click "Forgot password?", enter your
   email, then on the OTP screen enter code **`1234`** (demo code), then set a new
   password.
6. To test **Protected Routes**: open `/dashboard` directly in a new private/incognito
   window — you'll be redirected to `/login`.
7. **Remember me**: uncheck it, log in, close the tab and reopen — you'll be logged out
   (tab-only session). Check it and repeat — you'll stay logged in.

## Folder structure

```
src/
  components/     # Reusable pieces: FormInput, PasswordStrengthMeter,
                   # ProtectedRoute, SessionTimeoutModal, AuthLayout
  context/         # AuthContext.jsx — all "backend" logic lives here
  pages/           # One file per screen
  styles/          # Design tokens (index.css) + auth UI styles (auth.css)
  utils/           # validation.js — email regex, password strength scoring
```

## Tech

- React 19 + Vite
- React Router v6 (`react-router-dom`)
- No UI library — hand-written CSS using design tokens (see `styles/index.css`)
