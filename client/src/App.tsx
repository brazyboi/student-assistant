import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChatPage from "@/pages/ChatPage";
import LoginPage from "@/pages/LoginPage";
import LandingPage from "@/pages/LandingPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuthSession } from "@/hooks/useAuthSession";

export default function App() {
  useAuthSession(); 

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
           <Route path="/" element={<ChatPage />} />
           {/* <Route path="/profile" element={<ProfilePage />} /> */}
        </Route>

        <Route path="*" element={<LandingPage />} />

      </Routes>
    </BrowserRouter>
  );
}