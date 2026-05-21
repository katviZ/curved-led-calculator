import { useState } from "react";

const BRAND = {
  navy: "#06001A", navyLight: "#0F0826", purple: "#793494", magenta: "#9d20d6",
  lavender: "#c89dd9", cream: "#F5EFE6", line: "#2A1F3D",
  amber: "#E5B454", green: "#7BC474", red: "#E26464",
};
const FRAUNCES = "'Fraunces', Georgia, serif";
const MANROPE = "'Manrope', system-ui, sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";

function Field({ label, required, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{
        fontSize: 11,
        letterSpacing: 1.2,
        textTransform: "uppercase",
        color: BRAND.lavender,
        fontFamily: MANROPE,
        fontWeight: 600,
      }}>
        {label} {required && <span style={{ color: BRAND.red }}>*</span>}
      </label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        background: BRAND.navy,
        border: `1px solid ${BRAND.line}`,
        color: BRAND.cream,
        padding: "10px 12px",
        fontFamily: MONO,
        fontSize: 14,
        borderRadius: 6,
        outline: "none",
        width: "100%",
        boxSizing: "border-box",
      }}
    />
  );
}

export default function TrialForm({ initialEmail, onClose, onSuccess }) {
  const [form, setForm] = useState({
    email: initialEmail || "",
    name: "",
    company: "",
    role: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const update = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email.trim() || !form.name.trim()) {
      setError("Email and name are required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/trial/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        onSuccess({ ...form, expiryDate: data.expiryDate });
      } else {
        setError(data.message || "Trial request failed");
      }
    } catch (err) {
      setError("Connection failed. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}>
        <div style={{
          background: BRAND.navyLight,
          border: `1px solid ${BRAND.line}`,
          borderRadius: 16,
          padding: 40,
          width: 420,
          maxWidth: "90vw",
          textAlign: "center",
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
          <h3 style={{
            fontFamily: FRAUNCES,
            fontSize: 24,
            color: BRAND.cream,
            marginBottom: 12,
          }}>
            Trial Approved!
          </h3>
          <p style={{
            fontSize: 14,
            color: BRAND.lavender,
            fontFamily: MANROPE,
            lineHeight: 1.6,
            marginBottom: 24,
          }}>
            Your 7-day trial has been activated.<br />
            You now have full access to the calculator.
          </p>
          <button
            onClick={onClose}
            style={{
              background: BRAND.purple,
              color: BRAND.cream,
              border: "none",
              padding: "12px 32px",
              fontFamily: MANROPE,
              fontWeight: 700,
              fontSize: 14,
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Start Using Calculator
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 100,
    }}>
      <div style={{
        background: BRAND.navyLight,
        border: `1px solid ${BRAND.line}`,
        borderRadius: 16,
        padding: 32,
        width: 480,
        maxWidth: "90vw",
        maxHeight: "90vh",
        overflowY: "auto",
      }}>
        <h3 style={{
          fontFamily: FRAUNCES,
          fontSize: 22,
          marginBottom: 8,
          color: BRAND.cream,
        }}>
          Request 7-Day Trial
        </h3>
        <p style={{
          fontSize: 13,
          color: BRAND.lavender,
          opacity: 0.7,
          fontFamily: MANROPE,
          marginBottom: 24,
        }}>
          Fill in your details to get instant access
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Field label="Email" required>
              <Input value={form.email} onChange={update("email")} placeholder="you@company.com" type="email" />
            </Field>
            <Field label="Full Name" required>
              <Input value={form.name} onChange={update("name")} placeholder="John Doe" />
            </Field>
            <Field label="Company Name">
              <Input value={form.company} onChange={update("company")} placeholder="Acme LED Solutions" />
            </Field>
            <Field label="Designation / Role">
              <Input value={form.role} onChange={update("role")} placeholder="Engineer, Designer, etc." />
            </Field>
            <Field label="Phone Number">
              <Input value={form.phone} onChange={update("phone")} placeholder="+1 234 567 8900" />
            </Field>
          </div>

          {error && (
            <div style={{
              fontSize: 12,
              color: BRAND.red,
              fontFamily: MANROPE,
              marginTop: 16,
              padding: "10px 12px",
              background: `${BRAND.red}1A`,
              borderRadius: 6,
            }}>
              {error}
            </div>
          )}

          <div style={{ display: "flex", gap: 12, marginTop: 24, justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                background: "transparent",
                color: BRAND.lavender,
                border: `1px solid ${BRAND.line}`,
                padding: "10px 20px",
                fontFamily: MANROPE,
                fontWeight: 600,
                fontSize: 13,
                borderRadius: 8,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.5 : 1,
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                background: BRAND.purple,
                color: BRAND.cream,
                border: "none",
                padding: "10px 24px",
                fontFamily: MANROPE,
                fontWeight: 700,
                fontSize: 13,
                borderRadius: 8,
                cursor: loading ? "wait" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Processing..." : "Request Trial"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
