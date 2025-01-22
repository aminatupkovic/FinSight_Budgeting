import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Dashboard } from "./pages/dashboard";
import { Auth } from "./pages/auth";
import { FinRecordProvider } from "./contexts/fin-record-context";
import { SignedIn, SignedOut, RedirectToSignIn, useAuth, UserButton } from "@clerk/clerk-react";
import logo from "./assets/FinSight-removebg-preview.png";
import "./App.css";

function App() {
  const { isSignedIn } = useAuth();

  return (
    <Router>
      <div className="app-container">
        {/* Navbar */}
        <div className="navbar">
          <div className="img-and-dash">
            <img src={logo} className="logo-img" alt="FinSight Logo" />
            {isSignedIn && (
              <Navigate to="/" />
            )}
          </div>
          <div className="user-section">
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>

        {/* Routes */}
        <Routes>
          {/* Redirect to /auth if not signed in */}
          <Route
            path="/"
            element={
              isSignedIn ? (
                <FinRecordProvider>
                  <Dashboard />
                </FinRecordProvider>
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          />

          {/* Auth Page */}
          <Route
            path="/auth"
            element={
              <SignedOut>
                <Auth redirectUrl="/" />
              </SignedOut>
            }
          />

          {/* Catch-All Route */}
          <Route
            path="*"
            element={<Navigate to={isSignedIn ? "/" : "/auth"} replace />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;




