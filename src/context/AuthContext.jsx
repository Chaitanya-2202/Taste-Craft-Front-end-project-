import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
const USERS_KEY = "tastecraft_users_v1";
const SESSION_KEY = "tastecraft_session_v1";

const starterUsers = [
  { id: "admin-1", name: "TasteCraft Admin", email: "admin@tastecraft.com", password: "admin123", role: "admin" }
];

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem(USERS_KEY);
    return saved ? JSON.parse(saved) : starterUsers;
  });
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(SESSION_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => localStorage.setItem(USERS_KEY, JSON.stringify(users)), [users]);
  useEffect(() => {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else localStorage.removeItem(SESSION_KEY);
  }, [user]);

  function signup(name, email, password) {
    const cleanEmail = email.trim().toLowerCase();
    if (users.some(u => u.email === cleanEmail)) return { ok: false, message: "An account with this email already exists." };
    const newUser = { id: crypto.randomUUID(), name: name.trim(), email: cleanEmail, password, role: "user" };
    setUsers(prev => [...prev, newUser]);
    setUser({ id: newUser.id, name: newUser.name, email: newUser.email, role: "user" });
    return { ok: true };
  }

  function login(email, password, expectedRole) {
    const cleanEmail = email.trim().toLowerCase();
    const found = users.find(u => u.email === cleanEmail && u.password === password);
    if (!found) return { ok: false, message: "Email or password is incorrect." };
    if (expectedRole && found.role !== expectedRole) {
      return { ok: false, message: `This account is not registered for ${expectedRole} login. Please choose the correct login option.` };
    }
    setUser({ id: found.id, name: found.name, email: found.email, role: found.role });
    return { ok: true };
  }

  function logout() { setUser(null); }
  return <AuthContext.Provider value={{ user, users, signup, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}