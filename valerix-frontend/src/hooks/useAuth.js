import { useEffect } from "react";
import { useAuthStore } from "../stores/useAuthStore.js";
import { me } from "../api/auth.js";

export function useAuthSync() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const clear = useAuthStore((s) => s.clear);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    me()
      .then((r) => {
        setAuth(token, r.data.user);
      })
      .catch(() => clear());
    // eslint-disable-next-line
  }, []);
}
