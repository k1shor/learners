import Header from "./Header";
import Footer from "./Footer";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import LearnerSidebar from "./LearnerSidebar";

const Layout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        isLoggedIn={isLoggedIn}
        onLogin={() => setIsLoggedIn(true)}
        onLogout={() => setIsLoggedIn(false)}
      />
      <main className="flex-1">
        {isLoggedIn && (
          <div className="flex min-h-[calc(100vh-68px)] bg-white">
            <LearnerSidebar />
            <div className="flex-1 px-6 py-8">
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
