import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup"; // Signup import kiya
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRegister from "./pages/AdminRegister";
import AdminDashboard from "./pages/AdminDashboard";
import CustomerLanding from "./pages/PaymentScreen"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/signup" element={<Signup />} /> {/* Naya Route */}
        <Route path="/b/:slug" element={<CustomerLanding />} />
       
        {/* Protected Routes */}
        <Route
          path="/admin/register"
          element={
            <ProtectedRoute>
              <AdminRegister />
            </ProtectedRoute>
          }
        />

         <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/admin/signup" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
