import React, { useState } from "react";
import { Amplify } from "aws-amplify";
import { signIn, confirmSignIn, signOut } from "aws-amplify/auth";
import amplifyconfig from "./amplifyconfiguration.json";
import ReCAPTCHA from "react-google-recaptcha";

Amplify.configure(amplifyconfig);

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [message, setMessage] = useState("");
  const [userSession, setUserSession] = useState(null);

  const handleSignIn = async () => {
    setMessage("");
    setShowCaptcha(false);
    try {
      const { isSignedIn, nextStep, userId } = await signIn({ username, password });
      setUserSession({ userId }); // Save userId for confirmSignIn if needed

      if (nextStep.signInStep === "CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE") {
        setShowCaptcha(true);
      } else if (nextStep.signInStep === "DONE" || isSignedIn) {
        setMessage("Signed in successfully!");
      } else {
        setMessage("Unexpected next step: " + nextStep.signInStep);
      }
    } catch (e) {
      setMessage("Sign in failed: " + (e.message || e));
    }
  };

  const handleCaptcha = async (token) => {
    try {
      await confirmSignIn({
        challengeResponse: token,
        userId: userSession?.userId // Needed for Amplify v6+
      });
      setMessage("Signed in successfully!");
      setShowCaptcha(false);
    } catch (e) {
      setMessage("Captcha failed: " + (e.message || e));
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setMessage("Signed out!");
      setShowCaptcha(false);
      setUsername("");
      setPassword("");
      setUserSession(null);
    } catch (e) {
      setMessage("Sign out failed: " + (e.message || e));
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Sign In</h2>
      <input
        type="text"
        placeholder="username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />
      <button onClick={handleSignIn} style={{ width: "100%", marginBottom: 10 }}>Sign In</button>
      <button onClick={handleSignOut} style={{ width: "100%", marginBottom: 10 }}>Sign Out</button>
      {showCaptcha && (
        <ReCAPTCHA
          sitekey="6Lc7gDkrAAAAANyQMgrHYvyGMNtz47kWGkRsdEBV"
          onChange={handleCaptcha}
        />
      )}
      <div style={{ color: "red", marginTop: 10 }}>{message}</div>
    </div>
  );
}

export default App;
