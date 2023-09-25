import React from "react";
import ChatRoom from "./pages/Chat-Room";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Error from "./pages/Error";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/room/:roomCode" element={<ChatRoom />} />
      <Route path="*" element={<Error />} />
    </Routes>
  );
}
