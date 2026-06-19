import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import SATEnglish from "./pages/SATEnglish";
import SATMath from "./pages/SATMath";
import ITDeveloping from "./pages/ITDeveloping";
import VideoLesson from "./pages/VideoLesson";
import PracticeCenter from "./pages/PracticeCenter";
import MathPractice from "./pages/MathPractice";
import EnglishPractice from "./pages/EnglishPractice";
import Analytics from "./pages/Analytics";
import Search from "./pages/Search";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-slate-950 flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/sat-english" element={<SATEnglish />} />
              <Route path="/sat-math" element={<SATMath />} />
              <Route path="/it-developing" element={<ITDeveloping />} />
              <Route path="/practice" element={<PracticeCenter />} />
              <Route path="/practice/math" element={<MathPractice />} />
              <Route path="/practice/english" element={<EnglishPractice />} />
              <Route path="/search" element={<Search />} />

              {/* Protected */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/lesson/:courseId/:lessonId" element={<ProtectedRoute><VideoLesson /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />

              {/* Admin */}
              <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}