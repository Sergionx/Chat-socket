import { Outlet } from "react-router-dom";
import Blobs from "../components/Blobs";

export default function MainLayout() {
  return (
    <div
      className="bg-primary-400/40 min-h-[100svh]
        grid place-items-center"
    >
      <Blobs />
      <Outlet />
    </div>
  );
}
