import React, { useState } from "react";
import { Amplify } from "aws-amplify";
import { signIn, confirmSignIn } from "aws-amplify/auth";
import amplifyconfig from "./amplifyconfiguration.json";
import ReCAPTCHA from "react-google-recaptcha";

Amplify.configure(amplifyconfig);

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [message, setMessage] = useState("");

  const handleSignIn = async () => {
    setMessage("");
    try {
      const response = await signIn({ username, password, options: { authFlowType: "CUSTOM_WITH_SRP" } });
      if (response.challengeName === "CUSTOM_CHALLENGE") {
        setShowCaptcha(true);
      } else {
        setMessage("Signed in successfully!");
      }
    } catch (e) {
      setMessage("Sign in failed: " + e.message);
    }
  };

  const handleCaptcha = async (token) => {
    try {
      await confirmSignIn({ challengeResponse: token });
      setMessage("Signed in successfully!");
      setShowCaptcha(false);
    } catch (e) {
      setMessage("Captcha failed: " + e.message);
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

