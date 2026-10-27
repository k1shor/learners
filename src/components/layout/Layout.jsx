import { useState } from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import LearnerSidebar from "./LearnerSidebar";

const Layout = () => {
  const [user, setUser] = useState(null);
  const [hasLoggedOut, setHasLoggedOut] = useState(false);
  const login = () => {
    setUser({ name: "Learner" });
    setHasLoggedOut(false);
  };
  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
      });
    } finally {
      setUser(null);
      setHasLoggedOut(true);
    }
  };
  const outletContext = { user };

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f1e9] text-[#203832]">
      <Header user={user} onLogin={login} onLogout={logout} />
      {!hasLoggedOut && (
        <>
          <main className="flex-1">
            <div className="app-workspace flex min-h-[calc(100vh-76px)] flex-col sm:flex-row">
              <LearnerSidebar user={user} />
              <div className="app-main flex-1 px-4 py-7 sm:px-7 sm:py-9 lg:px-10">
                <Outlet context={outletContext} />
              </div>
            </div>
          </main>
          <Footer />
        </>
      )}
    </div>
  );
};

export default Layout;
