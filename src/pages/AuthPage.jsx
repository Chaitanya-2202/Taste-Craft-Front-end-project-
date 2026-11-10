import React, { useState } from "react";
import { ChefHat, Eye, EyeOff, ArrowRight, Sparkles, UserRound, ShieldCheck, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function AuthPage() {
  const { login, signup } = useAuth();
  const [selectedRole, setSelectedRole] = useState(null);
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  function chooseRole(role) {
    setSelectedRole(role);
    setMode("login");
    setName("");
    setEmail("");
    setPassword("");
    setError("");
    setNotice("");
  }

  function submit(e) {
    e.preventDefault();
    setError("");
    setNotice("");
    if (mode === "signup") {
      if (selectedRole !== "user") return;
      if (password.length < 6) {
        setError("Please use a password with at least 6 characters.");
        return;
      }
      const result = signup(name, email, password);
      if (!result.ok) setError(result.message);
    } else {
      const result = login(email, password, selectedRole);
      if (!result.ok) setError(result.message);
    }
  }

  function switchMode(next) {
    setMode(next);
    setError("");
    setNotice("");
  }

  return (
    <main className="auth-layout">
      <section className="auth-visual">
        <div className="auth-visual-overlay"></div>
        <div className="auth-visual-inner">
          <a className="brand brand-light" href="#"><span className="brand-mark"><ChefHat size={23}/></span><span>TasteCraft<span className="brand-dot">.</span></span></a>
          <div className="visual-copy"><span className="visual-kicker"><Sparkles size={15}/> YOUR COMMUNITY COOKBOOK</span><h1>Good food.<br/>Great memories.<br/><em>Made together.</em></h1><p>Discover recipes, share your kitchen creations and find your next favourite meal.</p></div>
          <div className="visual-footer">COOK · SHARE · CONNECT</div>
        </div>
      </section>
      <section className="auth-panel">
        <div className="auth-box">
          <a className="brand brand-mobile" href="#"><span className="brand-mark"><ChefHat size={22}/></span><span>TasteCraft<span className="brand-dot">.</span></span></a>

          {!selectedRole ? (
            <div className="role-choice">
              <div className="auth-heading">
                <div className="eyebrow">WELCOME TO TASTECRAFT</div>
                <h2>Choose how to continue.</h2>
                <p>Select your account type to sign in.</p>
              </div>
              <div className="role-choice-list">
                <button type="button" className="role-choice-card" onClick={() => chooseRole("user")}>
                  <span className="role-choice-icon"><UserRound size={23}/></span>
                  <span className="role-choice-copy"><strong>User Login</strong><small>Explore recipes, share your creations and save favourites.</small></span>
                  <ArrowRight size={19}/>
                </button>
                <button type="button" className="role-choice-card" onClick={() => chooseRole("admin")}>
                  <span className="role-choice-icon"><ShieldCheck size={23}/></span>
                  <span className="role-choice-copy"><strong>Admin Login</strong><small>Access the admin area and manage community recipes.</small></span>
                  <ArrowRight size={19}/>
                </button>
              </div>
              <p className="auth-legal">Cook · Share · Connect</p>
            </div>
          ) : (
            <>
              <button type="button" className="auth-back" onClick={() => { setSelectedRole(null); setError(""); setNotice(""); }}>
                <ArrowLeft size={16}/> Back to account type
              </button>
              <div className="auth-heading">
                <div className="eyebrow">{selectedRole === "admin" ? "ADMIN ACCESS" : "USER ACCESS"}</div>
                <h2>{mode === "login" ? (selectedRole === "admin" ? "Welcome back, admin." : "Your table is waiting.") : "Join the table."}</h2>
                <p>{mode === "login" ? (selectedRole === "admin" ? "Sign in to manage your TasteCraft community." : "Sign in to explore a world of flavour.") : "Create an account and share what you love to cook."}</p>
              </div>
              {selectedRole === "user" && (
                <div className="auth-tabs">
                  <button className={mode === "login" ? "active" : ""} onClick={() => switchMode("login")}>Log in</button>
                  <button className={mode === "signup" ? "active" : ""} onClick={() => switchMode("signup")}>Create account</button>
                </div>
              )}
              <form onSubmit={submit} className="auth-form">
                {mode === "signup" && selectedRole === "user" && <label>Your name<input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Chaitanya" required autoComplete="name"/></label>}
                <label>Email address<input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required autoComplete="email"/></label>
                <label>Password<div className="password-wrap"><input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder={mode === "signup" ? "At least 6 characters" : "Enter your password"} required autoComplete={mode === "login" ? "current-password" : "new-password"}/><button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}</button></div></label>
                {error && <div className="form-error">{error}</div>}
                {notice && <div className="form-success">{notice}</div>}
                <button className="button button-primary button-wide" type="submit">{mode === "login" ? "Sign in" : "Create my account"} <ArrowRight size={18}/></button>
              </form>
              {selectedRole === "user" && <div className="auth-switch">{mode === "login" ? <>New to TasteCraft? <button onClick={() => switchMode("signup")}>Create an account</button></> : <>Already have an account? <button onClick={() => switchMode("login")}>Sign in</button></>}</div>}
              {selectedRole === "admin" && <div className="admin-hint"><strong>Admin demo credentials</strong><span>admin@tastecraft.com</span><span>Password: admin123</span></div>}
              <p className="auth-legal">By continuing, you agree to keep this kitchen kind, creative and welcoming.</p>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
