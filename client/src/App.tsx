import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChatPage from "@/pages/ChatPage";
import LoginPage from "@/pages/LoginPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuthSession } from "@/hooks/useAuthSession";

export default function App() {
  useAuthSession(); 

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
           <Route path="/" element={<ChatPage />} />
           {/* <Route path="/profile" element={<ProfilePage />} /> */}
        </Route>

        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}