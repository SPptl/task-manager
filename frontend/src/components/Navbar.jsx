import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = Boolean(localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur-xl shadow-sm sticky top-0 z-20">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/dashboard" className="text-lg font-semibold tracking-tight text-slate-900">
          TaskFlow
        </Link>
        <nav className="flex items-center gap-3 text-sm font-medium text-slate-700">
          {token ? (
            <>
              <Link className="rounded-full px-4 py-2 transition hover:bg-slate-100" to="/dashboard">
                Dashboard
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="rounded-full px-4 py-2 transition hover:bg-slate-100" to="/login">
                Login
              </Link>
              <Link className="rounded-full bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-700" to="/signup">
                Signup
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
