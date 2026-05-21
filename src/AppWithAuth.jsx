import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginScreen from "./components/LoginScreen";
import TrialForm from "./components/TrialForm";
import CurvedLEDCalculator from "./App";

function AuthWrapper() {
  const { user, login, loading } = useAuth();
  const [showTrialForm, setShowTrialForm] = useState(false);
  const [trialEmail, setTrialEmail] = useState("");

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#06001A",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#F5EFE6",
        fontFamily: "system-ui",
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <LoginScreen
          onLogin={login}
          onRequestTrial={(email) => {
            setTrialEmail(email || "");
            setShowTrialForm(true);
          }}
        />
        {showTrialForm && (
          <TrialForm
            initialEmail={trialEmail}
            onClose={() => setShowTrialForm(false)}
            onSuccess={(trialData) => {
              setShowTrialForm(false);
              login({ ...trialData, type: "trial" });
            }}
          />
        )}
      </>
    );
  }

  return <CurvedLEDCalculator />;
}

export default function AppWithAuth() {
  return (
    <AuthProvider>
      <AuthWrapper />
    </AuthProvider>
  );
}
