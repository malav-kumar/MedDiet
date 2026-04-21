import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { AuthProvider } from "../context/AuthContext";
import { HealthProvider } from "../context/HealthContext";
import Navbar from "../components/Navbar";
import PrivateRoute from "../components/PrivateRoute";
import Login from "./Login";
import Signup from "./Signup";

// Lazy-loaded pages keep the auth bundle small.
const Dashboard = lazy(() => import("./Dashboard"));
const MedicineChecker = lazy(() => import("./MedicineChecker"));
const ConditionGuide = lazy(() => import("./ConditionGuide"));
const AIMealPlanner = lazy(() => import("./AIMealPlanner"));
const Profile = lazy(() => import("./Profile"));

const PageFallback = () => (
  <div className="flex items-center justify-center py-20 text-muted-foreground">
    <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading…
  </div>
);

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
                <Suspense fallback={<PageFallback />}>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/medicines" element={<MedicineChecker />} />
                    <Route path="/conditions" element={<ConditionGuide />} />
                    <Route path="/meals" element={<AIMealPlanner />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
              </Shell>
            </PrivateRoute>
          }
        />
      </Routes>
    </HealthProvider>
  </AuthProvider>
);

export default App;
