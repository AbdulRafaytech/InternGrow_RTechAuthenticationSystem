import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';

// ---------------------------------------------------------------
// This context is the "brain" of the auth module. There is no real
// backend here — we simulate one with localStorage + fake delays,
// so every screen (Login, Register, OTP, Reset...) has something
// real to talk to. This covers the UI/UX only, as required — real
// email/SMS delivery of OTP codes would be a backend's job.
// ---------------------------------------------------------------

const AuthContext = createContext(null);

const USERS_KEY = 'rtech_users';
const SESSION_KEY = 'rtech_session'; // survives browser restart (Remember me)
const TAB_SESSION_KEY = 'rtech_tab_session'; // cleared when tab/browser closes

const SESSION_TIMEOUT_MS = 60 * 1000; // 60s idle -> warn (kept short so you can DEMO it easily)
const WARNING_COUNTDOWN_MS = 15 * 1000; // 15s to respond before auto logout
const DEMO_OTP = '1234'; // stands in for the code a backend would text/email

function readUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
}
function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [sessionWarning, setSessionWarning] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const persisted = localStorage.getItem(SESSION_KEY);
    const tabOnly = sessionStorage.getItem(TAB_SESSION_KEY);
    const raw = persisted || tabOnly;
    if (raw) setUser(JSON.parse(raw));
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!user) return undefined;

    let idleTimer;
    let logoutTimer;

    const resetTimers = () => {
      clearTimeout(idleTimer);
      clearTimeout(logoutTimer);
      setSessionWarning(false);
      idleTimer = setTimeout(() => {
        setSessionWarning(true);
        logoutTimer = setTimeout(() => {
          logout();
        }, WARNING_COUNTDOWN_MS);
      }, SESSION_TIMEOUT_MS);
    };

    const activityEvents = ['mousemove', 'keydown', 'click', 'scroll'];
    activityEvents.forEach((evt) => window.addEventListener(evt, resetTimers));
    resetTimers();

    return () => {
      clearTimeout(idleTimer);
      clearTimeout(logoutTimer);
      activityEvents.forEach((evt) => window.removeEventListener(evt, resetTimers));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const stayLoggedIn = useCallback(() => {
    setSessionWarning(false);
    setUser((u) => (u ? { ...u } : u));
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    await delay(600);
    const users = readUsers();
    if (users.some((u) => u.email === email)) {
      throw new Error('An account with this email already exists');
    }
    const newUser = { name, email, password, verified: false };
    writeUsers([...users, newUser]);
    return newUser;
  }, []);

  const verifyEmail = useCallback(async (email) => {
    await delay(500);
    const users = readUsers();
    const idx = users.findIndex((u) => u.email === email);
    if (idx === -1) throw new Error('Account not found');
    users[idx].verified = true;
    writeUsers(users);
    return true;
  }, []);

  const login = useCallback(async ({ email, password, rememberMe }) => {
    await delay(600);
    const users = readUsers();
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) throw new Error('Invalid email or password');
    if (!found.verified) throw new Error('Please verify your email before logging in');

    const sessionUser = { name: found.name, email: found.email };
    if (rememberMe) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
      sessionStorage.removeItem(TAB_SESSION_KEY);
    } else {
      sessionStorage.setItem(TAB_SESSION_KEY, JSON.stringify(sessionUser));
      localStorage.removeItem(SESSION_KEY);
    }
    setUser(sessionUser);
    return sessionUser;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(TAB_SESSION_KEY);
    setUser(null);
    setSessionWarning(false);
  }, []);

  const requestPasswordReset = useCallback(async (email) => {
    await delay(600);
    const users = readUsers();
    if (!users.some((u) => u.email === email)) {
      throw new Error('No account found with this email');
    }
    return true;
  }, []);

  const resetPassword = useCallback(async ({ email, newPassword }) => {
    await delay(600);
    const users = readUsers();
    const idx = users.findIndex((u) => u.email === email);
    if (idx === -1) throw new Error('Account not found');
    users[idx].password = newPassword;
    writeUsers(users);
    return true;
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      sessionWarning,
      login,
      logout,
      register,
      verifyEmail,
      requestPasswordReset,
      resetPassword,
      stayLoggedIn,
      SESSION_TIMEOUT_MS,
      WARNING_COUNTDOWN_MS,
      DEMO_OTP,
    }),
    [user, loading, sessionWarning, login, logout, register, verifyEmail, requestPasswordReset, resetPassword, stayLoggedIn]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
