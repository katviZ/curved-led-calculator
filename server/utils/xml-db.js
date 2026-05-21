const fs = require("fs");
const path = require("path");
const xml2js = require("xml2js");

const DB_DIR = path.join(__dirname, "..", "db");
const parser = new xml2js.Parser({ explicitArray: false });
const builder = new xml2js.Builder();

function sanitize(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function readXML(filename) {
  const filePath = path.join(DB_DIR, filename);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const xml = fs.readFileSync(filePath, "utf-8");
  return parser.parseStringPromise(xml);
}

async function writeXML(filename, data) {
  const filePath = path.join(DB_DIR, filename);
  const xml = builder.buildObject(data);
  fs.writeFileSync(filePath, xml, "utf-8");
}

async function addUser(user) {
  let data = await readXML("users.xml");
  if (!data || !data.users) {
    data = { users: { user: [] } };
  }
  if (!data.users.user) {
    data.users.user = [];
  }
  if (!Array.isArray(data.users.user)) {
    data.users.user = [data.users.user];
  }

  const exists = data.users.user.find(u => u.$.email === user.email);
  if (exists) {
    return { success: false, message: "User already exists" };
  }

  data.users.user.push({
    $: {
      email: sanitize(user.email),
      name: sanitize(user.name),
      company: sanitize(user.company || ""),
      role: sanitize(user.role || ""),
      phone: sanitize(user.phone || ""),
      status: "active",
      created: new Date().toISOString(),
    }
  });

  await writeXML("users.xml", data);
  return { success: true };
}

async function findUser(email) {
  const data = await readXML("users.xml");
  if (!data || !data.users || !data.users.user) return null;
  const users = Array.isArray(data.users.user) ? data.users.user : [data.users.user];
  return users.find(u => u.$.email === email) || null;
}

async function addTrial(trial) {
  let data = await readXML("trials.xml");
  if (!data || !data.trials) {
    data = { trials: { trial: [] } };
  }
  if (!data.trials.trial) {
    data.trials.trial = [];
  }
  if (!Array.isArray(data.trials.trial)) {
    data.trials.trial = [data.trials.trial];
  }

  const now = new Date();
  const expiry = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  data.trials.trial.push({
    $: {
      email: sanitize(trial.email),
      name: sanitize(trial.name),
      company: sanitize(trial.company || ""),
      role: sanitize(trial.role || ""),
      phone: sanitize(trial.phone || ""),
      requestedDate: now.toISOString(),
      expiryDate: expiry.toISOString(),
      status: "active",
    }
  });

  await writeXML("trials.xml", data);
  return { success: true, expiryDate: expiry.toISOString() };
}

async function findTrial(email) {
  const data = await readXML("trials.xml");
  if (!data || !data.trials || !data.trials.trial) return null;
  const trials = Array.isArray(data.trials.trial) ? data.trials.trial : [data.trials.trial];
  return trials.find(t => t.$.email === email) || null;
}

async function getAllTrials() {
  const data = await readXML("trials.xml");
  if (!data || !data.trials || !data.trials.trial) return [];
  return Array.isArray(data.trials.trial) ? data.trials.trial : [data.trials.trial];
}

async function addAnalyticsEvent(event) {
  let data = await readXML("analytics.xml");
  if (!data || !data.analytics) {
    data = { analytics: { event: [] } };
  }
  if (!data.analytics.event) {
    data.analytics.event = [];
  }
  if (!Array.isArray(data.analytics.event)) {
    data.analytics.event = [data.analytics.event];
  }

  data.analytics.event.push({
    $: {
      email: sanitize(event.email || "anonymous"),
      action: sanitize(event.action),
      timestamp: new Date().toISOString(),
      params: sanitize(event.params ? JSON.stringify(event.params) : ""),
    }
  });

  await writeXML("analytics.xml", data);
}

async function getAnalyticsSummary() {
  const data = await readXML("analytics.xml");
  if (!data || !data.analytics || !data.analytics.event) {
    return { totalEvents: 0, events: [], byAction: {}, byEmail: {} };
  }
  const events = Array.isArray(data.analytics.event) ? data.analytics.event : [data.analytics.event];

  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const byAction = {};
  const byEmail = {};
  let todayCount = 0;
  let weekCount = 0;
  let monthCount = 0;

  events.forEach(e => {
    const action = e.$.action;
    const email = e.$.email;
    const ts = e.$.timestamp;

    byAction[action] = (byAction[action] || 0) + 1;
    byEmail[email] = (byEmail[email] || 0) + 1;

    if (ts.startsWith(today)) todayCount++;
    if (new Date(ts) >= weekAgo) weekCount++;
    if (new Date(ts) >= monthAgo) monthCount++;
  });

  return {
    totalEvents: events.length,
    todayCount,
    weekCount,
    monthCount,
    byAction,
    byEmail,
    recentEvents: events.slice(-50).reverse(),
  };
}

module.exports = {
  addUser,
  findUser,
  addTrial,
  findTrial,
  getAllTrials,
  addAnalyticsEvent,
  getAnalyticsSummary,
};
