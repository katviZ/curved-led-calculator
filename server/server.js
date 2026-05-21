const express = require("express");
const cors = require("cors");
const path = require("path");
const {
  addUser,
  findUser,
  addTrial,
  findTrial,
  getAllTrials,
  addAnalyticsEvent,
  getAnalyticsSummary,
} = require("./utils/xml-db");

const app = express();
const PORT = process.env.PORT || 3001;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

// Set production mode if not in dev
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  process.env.NODE_ENV = "production";
}

app.use(cors());
app.use(express.json());

// Serve static files in production
app.use(express.static(path.join(__dirname, "..", "dist")));

// Login endpoint
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email required" });
    }

    const user = await findUser(email);
    if (user) {
      await addAnalyticsEvent({ email, action: "login" });
      return res.json({
        success: true,
        user: {
          email: user.$.email,
          name: user.$.name,
          company: user.$.company,
          role: user.$.role,
          type: "user",
        },
      });
    }

    const trial = await findTrial(email);
    if (trial) {
      const expiry = new Date(trial.$.expiryDate);
      if (expiry > new Date()) {
        await addAnalyticsEvent({ email, action: "login" });
        return res.json({
          success: true,
          user: {
            email: trial.$.email,
            name: trial.$.name,
            company: trial.$.company,
            role: trial.$.role,
            type: "trial",
            expiryDate: trial.$.expiryDate,
          },
        });
      } else {
        return res.json({
          success: false,
          message: "Trial expired. Please contact us for full access.",
          expired: true,
        });
      }
    }

    res.json({ success: false, message: "User not found", notFound: true });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Trial request endpoint (auto-approve)
app.post("/api/trial/request", async (req, res) => {
  try {
    const { email, name, company, role, phone } = req.body;
    if (!email || !name) {
      return res.status(400).json({ success: false, message: "Email and name required" });
    }

    const existingUser = await findUser(email);
    if (existingUser) {
      return res.json({ success: false, message: "User already has full access" });
    }

    const existingTrial = await findTrial(email);
    if (existingTrial) {
      const expiry = new Date(existingTrial.$.expiryDate);
      if (expiry > new Date()) {
        return res.json({ success: false, message: "Trial already active" });
      }
    }

    const result = await addTrial({ email, name, company, role, phone });
    await addAnalyticsEvent({ email, action: "trial_request" });

    res.json({
      success: true,
      message: "Trial approved! 7-day access granted.",
      expiryDate: result.expiryDate,
    });
  } catch (err) {
    console.error("Trial request error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Analytics tracking endpoint
app.post("/api/analytics/track", async (req, res) => {
  try {
    const { email, action, params } = req.body;
    if (!action) {
      return res.status(400).json({ success: false, message: "Action required" });
    }
    await addAnalyticsEvent({ email, action, params });
    res.json({ success: true });
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Analytics dashboard endpoint
app.get("/api/analytics/dashboard", async (req, res) => {
  try {
    const summary = await getAnalyticsSummary();
    res.json({ success: true, ...summary });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Admin login endpoint
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true, token: "admin-session-" + Date.now() });
  } else {
    res.status(401).json({ success: false, message: "Invalid password" });
  }
});

// Get all trials (admin only)
app.get("/api/admin/trials", async (req, res) => {
  try {
    const trials = await getAllTrials();
    res.json({ success: true, trials });
  } catch (err) {
    console.error("Trials fetch error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Catch-all for SPA routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Admin password: ${ADMIN_PASSWORD}`);
});
