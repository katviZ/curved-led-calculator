import { useState } from "react";

const BRAND = {
  navy: "#06001A", navyLight: "#0F0826", purple: "#793494", magenta: "#9d20d6",
  lavender: "#c89dd9", cream: "#F5EFE6", line: "#2A1F3D",
  amber: "#E5B454", green: "#7BC474", red: "#E26464",
};
const FRAUNCES = "'Fraunces', Georgia, serif";
const MANROPE = "'Manrope', system-ui, sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";

export default function LoginScreen({ onLogin, onRequestTrial }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.success) {
        onLogin(data.user);
      } else if (data.notFound) {
        onRequestTrial(email);
      } else if (data.expired) {
        setError(data.message);
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Connection failed. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: BRAND.navy,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    }}>
      <div style={{
        background: BRAND.navyLight,
        border: `1px solid ${BRAND.line}`,
        borderRadius: 16,
        padding: 40,
        width: 420,
        maxWidth: "100%",
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 10, letterSpacing: 3, color: BRAND.magenta, fontWeight: 700, textTransform: "uppercase" }}>
            Visual Rhyme · Engineering
          </div>
          <h1 style={{
            fontFamily: FRAUNCES,
            fontSize: 28,
            fontWeight: 600,
            color: BRAND.cream,
            margin: "12px 0 8px",
          }}>
            Curved LED <em style={{ color: BRAND.lavender }}>Calculator</em>
          </h1>
          <p style={{ fontSize: 13, color: BRAND.lavender, opacity: 0.7, fontFamily: MANROPE }}>
            Sign in to access the engineering toolkit
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{
              fontSize: 11,
              letterSpacing: 1.2,
              textTransform: "uppercase",
              color: BRAND.lavender,
              fontFamily: MANROPE,
              fontWeight: 600,
              display: "block",
              marginBottom: 8,
            }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              placeholder="you@company.com"
              style={{
                background: BRAND.navy,
                border: `1px solid ${BRAND.line}`,
                color: BRAND.cream,
                padding: "12px 14px",
                fontFamily: MONO,
                fontSize: 14,
                borderRadius: 8,
                outline: "none",
                width: "100%",
                boxSizing: "border-box",
              }}
            />
          </div>

          {error && (
            <div style={{
              fontSize: 12,
              color: BRAND.red,
              fontFamily: MANROPE,
              marginBottom: 16,
              padding: "10px 12px",
              background: `${BRAND.red}1A`,
              borderRadius: 6,
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: BRAND.purple,
              color: BRAND.cream,
              border: "none",
              padding: "12px 24px",
              fontFamily: MANROPE,
              fontWeight: 700,
              fontSize: 14,
              borderRadius: 8,
              cursor: loading ? "wait" : "pointer",
              width: "100%",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div style={{
          textAlign: "center",
          marginTop: 20,
          fontSize: 13,
          color: BRAND.lavender,
          fontFamily: MANROPE,
        }}>
          Don't have access?{" "}
          <button
            onClick={() => onRequestTrial(email)}
            style={{
              background: "none",
              border: "none",
              color: BRAND.amber,
              cursor: "pointer",
              fontFamily: MANROPE,
              fontWeight: 600,
              textDecoration: "underline",
              fontSize: 13,
            }}
          >
            Request 7-Day Trial
          </button>
        </div>
      </div>
    </div>
  );
}
