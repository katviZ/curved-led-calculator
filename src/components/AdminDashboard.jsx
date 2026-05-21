import { useState, useEffect } from "react";

const BRAND = {
  navy: "#06001A", navyLight: "#0F0826", purple: "#793494", magenta: "#9d20d6",
  lavender: "#c89dd9", cream: "#F5EFE6", line: "#2A1F3D",
  amber: "#E5B454", green: "#7BC474", red: "#E26464",
};
const FRAUNCES = "'Fraunces', Georgia, serif";
const MANROPE = "'Manrope', system-ui, sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";

function MetricCard({ label, value, accent, sub }) {
  return (
    <div style={{
      background: BRAND.navyLight,
      border: `1px solid ${BRAND.line}`,
      borderLeft: `3px solid ${accent || BRAND.purple}`,
      borderRadius: 12,
      padding: 20,
    }}>
      <div style={{ fontSize: 11, letterSpacing: 1.4, textTransform: "uppercase", color: BRAND.lavender, opacity: 0.7, fontFamily: MANROPE, fontWeight: 600 }}>
        {label}
      </div>
      <div style={{ fontFamily: FRAUNCES, fontSize: 32, fontWeight: 600, color: accent || BRAND.cream, marginTop: 8 }}>
        {value}
      </div>
      {sub && <div style={{ fontFamily: MONO, fontSize: 11, color: BRAND.lavender, opacity: 0.6, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

export default function AdminDashboard({ onBack }) {
  const [adminAuth, setAdminAuth] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [trials, setTrials] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        setAdminAuth(true);
        localStorage.setItem("vr-admin", "true");
      } else {
        setError("Invalid password");
      }
    } catch {
      setError("Connection failed");
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboard = async () => {
    setRefreshing(true);
    try {
      const [dashRes, trialsRes] = await Promise.all([
        fetch("/api/analytics/dashboard"),
        fetch("/api/admin/trials"),
      ]);
      const dashData = await dashRes.json();
      const trialsData = await trialsRes.json();
      if (dashData.success) setDashboard(dashData);
      if (trialsData.success) setTrials(trialsData.trials || []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("vr-admin") === "true") {
      setAdminAuth(true);
    }
  }, []);

  useEffect(() => {
    if (adminAuth) {
      fetchDashboard();
      const interval = setInterval(fetchDashboard, 30000);
      return () => clearInterval(interval);
    }
  }, [adminAuth]);

  if (!adminAuth) {
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
          width: 400,
          maxWidth: "100%",
        }}>
          <h2 style={{ fontFamily: FRAUNCES, fontSize: 24, color: BRAND.cream, marginBottom: 20 }}>
            Admin Dashboard
          </h2>
          <form onSubmit={handleAdminLogin}>
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
                Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="Enter admin password"
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
              <div style={{ fontSize: 12, color: BRAND.red, fontFamily: MANROPE, marginBottom: 16 }}>
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
              }}
            >
              {loading ? "Authenticating..." : "Access Dashboard"}
            </button>
          </form>
          <button
            onClick={onBack}
            style={{
              background: "none",
              border: "none",
              color: BRAND.lavender,
              cursor: "pointer",
              fontFamily: MANROPE,
              fontSize: 13,
              marginTop: 16,
              textDecoration: "underline",
            }}
          >
            ← Back to Login
          </button>
        </div>
      </div>
    );
  }

  const now = new Date();
  const activeTrials = Array.isArray(trials) ? trials.filter(t => new Date(t.$.expiryDate) > now) : [];
  const expiredTrials = Array.isArray(trials) ? trials.filter(t => new Date(t.$.expiryDate) <= now) : [];

  return (
    <div style={{ minHeight: "100vh", background: BRAND.navy, color: BRAND.cream, fontFamily: MANROPE }}>
      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: `${BRAND.navy}E6`,
        backdropFilter: "blur(10px)",
        borderBottom: `1px solid ${BRAND.line}`,
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "14px 22px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 3, color: BRAND.magenta, fontWeight: 700, textTransform: "uppercase" }}>
              Visual Rhyme · Admin
            </div>
            <h1 style={{ fontFamily: FRAUNCES, fontSize: 22, fontWeight: 600, margin: "4px 0 0" }}>
              Analytics Dashboard
            </h1>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={fetchDashboard}
              disabled={refreshing}
              style={{
                background: "transparent",
                color: BRAND.lavender,
                border: `1px solid ${BRAND.line}`,
                padding: "8px 16px",
                fontFamily: MANROPE,
                fontWeight: 600,
                fontSize: 12,
                borderRadius: 8,
                cursor: refreshing ? "wait" : "pointer",
              }}
            >
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
            <button
              onClick={onBack}
              style={{
                background: BRAND.purple,
                color: BRAND.cream,
                border: "none",
                padding: "8px 16px",
                fontFamily: MANROPE,
                fontWeight: 600,
                fontSize: 12,
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              ← Back to App
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: 22 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
          <MetricCard label="Total Events" value={dashboard?.totalEvents || 0} accent={BRAND.purple} sub="All time" />
          <MetricCard label="Today" value={dashboard?.todayCount || 0} accent={BRAND.green} sub="Events today" />
          <MetricCard label="This Week" value={dashboard?.weekCount || 0} accent={BRAND.amber} sub="Last 7 days" />
          <MetricCard label="This Month" value={dashboard?.monthCount || 0} accent={BRAND.magenta} sub="Last 30 days" />
          <MetricCard label="Active Trials" value={activeTrials.length} accent={BRAND.green} sub="7-day trials" />
          <MetricCard label="Expired Trials" value={expiredTrials.length} accent={BRAND.red} sub="Need follow-up" />
        </div>

        {dashboard?.byAction && Object.keys(dashboard.byAction).length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ fontFamily: FRAUNCES, fontSize: 18, marginBottom: 16 }}>Actions Breakdown</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
              {Object.entries(dashboard.byAction).map(([action, count]) => (
                <div key={action} style={{
                  background: BRAND.navyLight,
                  border: `1px solid ${BRAND.line}`,
                  borderRadius: 8,
                  padding: 16,
                  textAlign: "center",
                }}>
                  <div style={{ fontSize: 11, color: BRAND.lavender, opacity: 0.7, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                    {action.replace(/_/g, " ")}
                  </div>
                  <div style={{ fontFamily: FRAUNCES, fontSize: 28, color: BRAND.cream }}>{count}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {dashboard?.byEmail && Object.keys(dashboard.byEmail).length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ fontFamily: FRAUNCES, fontSize: 18, marginBottom: 16 }}>Top Users</h3>
            <div style={{ background: BRAND.navyLight, border: `1px solid ${BRAND.line}`, borderRadius: 12, overflow: "hidden" }}>
              {Object.entries(dashboard.byEmail)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .map(([email, count], i) => (
                  <div key={email} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    borderBottom: i < 9 ? `1px solid ${BRAND.line}` : "none",
                  }}>
                    <span style={{ fontFamily: MONO, fontSize: 13 }}>{email}</span>
                    <span style={{ fontFamily: FRAUNCES, fontSize: 16, color: BRAND.amber }}>{count} events</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {Array.isArray(trials) && trials.length > 0 && (
          <div>
            <h3 style={{ fontFamily: FRAUNCES, fontSize: 18, marginBottom: 16 }}>Trial Requests</h3>
            <div style={{ background: BRAND.navyLight, border: `1px solid ${BRAND.line}`, borderRadius: 12, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr", padding: "10px 16px", background: BRAND.navy, fontSize: 10, letterSpacing: 1.2, textTransform: "uppercase", color: BRAND.lavender, fontWeight: 600 }}>
                <div>Email</div>
                <div>Name</div>
                <div>Company</div>
                <div>Expiry</div>
                <div>Status</div>
              </div>
              {trials.map((t, i) => {
                const isExpired = new Date(t.$.expiryDate) <= now;
                return (
                  <div key={t.$.email} style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr",
                    padding: "12px 16px",
                    borderBottom: `1px solid ${BRAND.line}`,
                    fontFamily: MONO,
                    fontSize: 12,
                  }}>
                    <div>{t.$.email}</div>
                    <div>{t.$.name}</div>
                    <div>{t.$.company || "—"}</div>
                    <div>{new Date(t.$.expiryDate).toLocaleDateString()}</div>
                    <div style={{ color: isExpired ? BRAND.red : BRAND.green }}>
                      {isExpired ? "Expired" : "Active"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
