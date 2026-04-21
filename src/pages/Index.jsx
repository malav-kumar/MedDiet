import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { HealthProvider } from "../context/HealthContext";
import Navbar from "../components/Navbar";
import PrivateRoute from "../components/PrivateRoute";
import Login from "./Login";
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import MedicineChecker from "./MedicineChecker";
import ConditionGuide from "./ConditionGuide";
import AIMealPlanner from "./AIMealPlanner";
import Profile from "./Profile";

const Shell = ({ children }) => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
  </div>
);

const App = () => (
  <AuthProvider>
    <HealthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <Shell>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/medicines" element={<MedicineChecker />} />
                  <Route path="/conditions" element={<ConditionGuide />} />
                  <Route path="/meals" element={<AIMealPlanner />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Shell>
            </PrivateRoute>
          }
        />
      </Routes>
    </HealthProvider>
  </AuthProvider>
);

export default App;
