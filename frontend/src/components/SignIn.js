import { useState } from "react";
import { auth } from "../firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";

function isSafari() {
  const ua = navigator.userAgent;
  return /Safari/.test(ua) && !/Chrome|Chromium|Edg/.test(ua);
}

export default function SignIn() {
  const [loading, setLoading] = useState(false);

  const handleGoogle = async () => {
    if (loading) return; // prevent double-clicks
    setLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      // Try popup first (better DX)
      await signInWithPopup(auth, provider);
    } catch (err) {
      // Common harmless error when a second popup is triggered
      if (err?.code === "auth/cancelled-popup-request") {
        // Ignore silently; another popup/sign-in was in flight
        return;
      }
      // Popup blocked or unsupported → redirect fallback (esp. Safari)
      if (
        err?.code === "auth/popup-blocked" ||
        err?.code === "auth/popup-closed-by-user" ||
        isSafari()
      ) {
        await signInWithRedirect(auth, provider);
        return;
      }
      // Anything else: show a simple message for debugging
      console.error(err);
      alert(`Sign-in failed: ${err.code || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Calorie Tracker</h2>
      <button onClick={handleGoogle} disabled={loading}>
        {loading ? "Signing in..." : "Sign in with Google"}
      </button>
      <p style={{ fontSize: 12, color: "#666", marginTop: 8 }}>
        If a popup is blocked, I’ll switch to redirect automatically.
      </p>
    </div>
  );
}
