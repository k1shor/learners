import Header from "./Header";
import Footer from "./Footer";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import LearnerSidebar from "./LearnerSidebar";

const Layout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f1e9] text-[#203832]">
      <Header
        isLoggedIn={isLoggedIn}
        onLogin={() => setIsLoggedIn(true)}
        onLogout={() => setIsLoggedIn(false)}
      />
      <main className="flex-1">
        {isLoggedIn && (
          <div className="app-workspace flex min-h-[calc(100vh-76px)] flex-col sm:flex-row">
            <LearnerSidebar />
            <div className="app-main flex-1 px-4 py-7 sm:px-7 sm:py-9 lg:px-10">
              <Outlet context={{ isLoggedIn }} />
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
