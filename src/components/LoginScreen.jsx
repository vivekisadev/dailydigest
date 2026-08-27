import React, { useState } from 'react';
import { Map } from 'lucide-react';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import '../login-04.css';

export default function LoginScreen({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedTracks, setSelectedTracks] = useState([0, 1, 2, 3]);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const handleAuth = async (e) => {
    e.preventDefault();
    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }
    
    setError("Connecting...");
    const userKey = username.trim();
    
    let existsInDb = false;
    let firebaseAvailable = true;
    const docRef = doc(db, "users", userKey);
    try {
      const snap = await getDoc(docRef);
      existsInDb = snap.exists();
    } catch (err) {
      console.error(err);
      if (err.code === 'permission-denied' || err.message?.includes('permission')) {
        firebaseAvailable = false;
        console.warn('Firebase permissions denied — falling back to local mode');
      } else {
        setError("Failed to connect. Check internet.");
        return;
      }
    }

    if (isSignUp) {
      if (email.trim().length < 5 || !email.includes("@")) {
        setError("Please enter a valid email address.");
        return;
      }
      if (existsInDb) {
        setError("Username already exists in the cloud. Please log in.");
        return;
      }
      
      const userData = {
        username: userKey,
        email: email.trim(),
        selectedTracks: selectedTracks.length > 0 ? selectedTracks : [0, 1, 2, 3],
        startDate: new Date().toISOString(),
        progress: {},
        customTasks: [],
        completedTaskNames: [],
        joinedRoadmaps: ["faang-90"],
        activeRoadmap: "faang-90",
        onboardingCompleted: false
      };
      
      if (firebaseAvailable) {
        try {
          await setDoc(docRef, userData);
        } catch (err) {
          console.warn('Firebase write failed, using local storage', err);
          localStorage.setItem(`vtask_user_${userKey}`, JSON.stringify(userData));
        }
      } else {
        localStorage.setItem(`vtask_user_${userKey}`, JSON.stringify(userData));
      }
    } else {
      if (!existsInDb && !firebaseAvailable) {
        const localData = localStorage.getItem(`vtask_user_${userKey}`);
        if (!localData) {
          setError("Account not found. Please click 'Sign up' to start fresh!");
          return;
        }
      } else if (!existsInDb) {
        setError("Account not found. Please click 'Sign up' to start fresh!");
        return;
      }
    }

    onLogin(userKey);
  };

  return (
    <div className="login-04-container">
      <div className="login-04-visual">
        <div className="login-04-logo">
          <Map size={24} color="#fff" />
          <span>GuideMe</span>
        </div>
        <div className="login-04-quote">
          <blockquote>
            "This platform completely transformed my interview prep. The 90-day MANGO roadmap gave me the exact structure I needed to succeed."
          </blockquote>
          <cite>— Sofia Davis, Software Engineer</cite>
        </div>
      </div>
      
      <div className="login-04-form-wrapper">
        <div className="login-04-form-container">
          <div className="login-04-header">
            <h1 className="login-04-title">{isSignUp ? "Create an account" : "Welcome back"}</h1>
            <p className="login-04-subtitle">
              {isSignUp ? "Enter your email below to create your account" : "Enter your username below to login to your account"}
            </p>
          </div>

          <form onSubmit={handleAuth} className="login-04-form">
            <div className="login-04-field">
              <label>Username</label>
              <input 
                type="text" 
                placeholder="johndoe" 
                value={username} 
                onChange={e => { setUsername(e.target.value); setError(""); }} 
                required 
              />
            </div>

            {isSignUp && (
              <div className="login-04-field">
                <label>Email Address</label>
                <input 
                  type="email" 
                  placeholder="m@example.com" 
                  value={email} 
                  onChange={e => { setEmail(e.target.value); setError(""); }} 
                  required 
                />
              </div>
            )}

            <div className="login-04-field">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label>Password</label>
                {!isSignUp && <a href="#" className="login-04-forgot">Forgot your password?</a>}
              </div>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={e => { setPassword(e.target.value); setError(""); }} 
              />
            </div>

            {error && <div className="login-04-error">{error}</div>}

            <button type="submit" className="login-04-submit">
              {isSignUp ? "Sign Up" : "Login"}
            </button>
          </form>

          <div className="login-04-toggle">
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <button type="button" onClick={() => { setIsSignUp(!isSignUp); setError(""); }}>
              {isSignUp ? "Login" : "Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
