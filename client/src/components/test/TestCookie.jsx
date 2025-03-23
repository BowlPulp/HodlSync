import { useState } from "react";
import axios from "axios";

export default function TestCookie() {
  const [cookieStatus, setCookieStatus] = useState("Not tested yet");
  const [cookies, setCookies] = useState("");

  const testCookie = async () => {
    try {
      // Send request to /test-cookie
      await axios.get("https://hodlsync-2.onrender.com/api/users/test-cookie", {
        withCredentials: true, // ✅ Ensures cookies are sent & received
      });

      // Wait a moment to allow cookie storage
      setTimeout(() => {
        const storedCookies = document.cookie;
        setCookies(storedCookies);
        setCookieStatus(storedCookies ? "Cookie received!" : "No cookie found.");
      }, 1000);
    } catch (error) {
      setCookieStatus("Error fetching cookie.");
      console.error("Error:", error);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Test Cookie</h2>
      <button onClick={testCookie} style={{ padding: "10px", fontSize: "16px" }}>
        Test /test-cookie
      </button>
      <p>Status: {cookieStatus}</p>
      <p><strong>Stored Cookies:</strong> {cookies || "None"}</p>
    </div>
  );
}
