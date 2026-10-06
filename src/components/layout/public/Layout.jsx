import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  const handleMyCourseClick = () => {
    console.log("Navigating to My Course...");
  };

  const handleLogoutClick = () => {
    console.log("Logging out...");
  };

  return (
    <div className="w-screen h-screen flex flex-col border-4 border-indigo-200 box-border overflow-hidden bg-slate-50">
      <Header
        onMyCourseClick={handleMyCourseClick}
        onLogoutClick={handleLogoutClick}
      />
      <main className="flex-grow p-6 overflow-y-auto">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
