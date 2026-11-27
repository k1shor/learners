import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import LearnerSidebar from "./LearnerSidebar";

const Layout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const login = () => setIsLoggedIn(true);

  const logout = () => {
    setIsLoggedIn(false);
    navigate("/", { replace: true });
  };

  const outletContext = { user: { name: "Learner" } };

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f1e9] text-[#203832]">
      <Header isLoggedIn={isLoggedIn} onLogin={login} onLogout={logout} />
      <main className="flex-1">
        {isLoggedIn ? (
          <div className="app-workspace flex min-h-[calc(100vh-76px)] flex-col sm:flex-row">
            <LearnerSidebar />
            <div className="app-main flex-1 px-4 py-7 sm:px-7 sm:py-9 lg:px-10">
              <Outlet context={outletContext} />
            </div>
          </div>
        ) : (
          <div className="grid min-h-[calc(100vh-152px)] place-items-center px-4 text-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#63824d]">
                Welcome
              </p>
              <h1 className="mt-2 text-3xl font-bold text-[#173c35]">
                Learn with E-LearnersHub
              </h1>
              <p className="mt-2 text-sm text-[#64756c]">
                Click Login to view courses and learning tools.
              </p>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
