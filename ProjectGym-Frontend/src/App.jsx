import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import Home from "./pages/Home";
import Activities from "./pages/Activities";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import TestConnection from "./pages/TestConnection";
import Classes from "./pages/Classes";
import Users from "./pages/Users";
import Reservations from "./pages/Reservations";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Trainers from './pages/Trainers'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/classes" element={<Classes />} />

          {/* Rutas protegidas - Solo usuarios autenticados */}
          <Route path="/reservations" element={
            <ProtectedRoute>
              <Reservations />
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          {/* Rutas protegidas - Solo ADMIN */}
          <Route path="/users" element={
            <ProtectedRoute requiredRole="ADMIN">
              <Users />
            </ProtectedRoute>
          } />

          <Route path="/entrenadores" element={
            <ProtectedRoute requiredRole="ADMIN">
              <Trainers />
            </ProtectedRoute>
          } />

          <Route path="/dashboard" element={
            <ProtectedRoute requiredRole="ADMIN">
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="/test" element={
            <ProtectedRoute requiredRole="ADMIN">
              <TestConnection />
            </ProtectedRoute>
          } />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}