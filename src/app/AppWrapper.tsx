import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import App from "./../App";

export default function AppWrapper() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = () => {
      console.log("Redirecting to login (auth:logout)");
      navigate("/demo/login");
    };

    window.addEventListener("auth:logout", handleLogout);

    return () => {
      window.removeEventListener("auth:logout", handleLogout);
    };
  }, [navigate]);

  return <App />;
}
