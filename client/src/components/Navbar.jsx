import { Link, useLocation } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Fetch logged-in user
  useEffect(() => {
    fetch("http://localhost:4000/api/auth/me", {
      credentials: "include", // 👈 important for cookies
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
      });
  }, []);

  const handleLogout = useCallback(async () => {
    await fetch("http://localhost:4000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    navigate("/");
  }, [navigate]);

  return (
    <header className="bg-white">
      <div className="px-4 py-3 flex items-center justify-between font-chewy">
        {/* Logo */}
        <Link to="/" className="text-2xl font-heading text-black">
          Memoire
        </Link>

        {/* Nav */}
        <nav className="flex gap-4">
          {!user ? (
            <Link to="/login">Sign in</Link>
          ) : (
            <button onClick={handleLogout} className="text-black ">
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
