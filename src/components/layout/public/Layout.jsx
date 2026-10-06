import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

export default function Layout({ children, userName = "User" }) {
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

      <div className="flex flex-grow overflow-hidden">
        <Sidebar userName={userName} />
        <main className="flex-grow p-6 overflow-y-auto flex flex-col gap-6">
          {/* Welcome Banner Section */}
          <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-sm flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Welcome, {userName}! 👋
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Here is what's happening with your learning journey today.
              </p>
            </div>
          </div>

          {/* Dynamic Page Content */}
          <div className="flex-grow">{children}</div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
