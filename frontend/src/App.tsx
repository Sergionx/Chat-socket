import ChatRoom from "./pages/Chat-Room";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import MainLayout from "./layouts/MainLayout";

export default function App() {
  return (
    <Routes>
      <Route path="*" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path=":roomCode" element={<ChatRoom />} />
      </Route>
    </Routes>
  );
}
