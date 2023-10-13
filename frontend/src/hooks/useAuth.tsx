import { useMemo } from "react";
import { useLocation } from "react-router";

export default function useAuth() {
  const location = useLocation();

  const userName: string = useMemo(
    () => location.state?.userName ?? "",
    [location.state?.userName]
  );

  const password: string = useMemo(
    () => location.state?.password ?? "",
    [location.state?.password]
  );

  return { userName, password };
}
