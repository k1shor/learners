import { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("John Doe");
  const [activeTab, setActiveTab] = useState("courses");

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleSignup = () => {
    // You can handle signup action or log them in directly for now
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "courses":
        return (
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              Your Enrolled Courses
            </h2>
            <p className="text-slate-600">
              Here you can see all the courses you are currently taking.
            </p>
          </div>
        );
      case "tasks":
        return (
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              Pending Tasks
            </h2>
            <p className="text-slate-600">
              Complete your assignments and quizzes here.
            </p>
          </div>
        );
      case "certificates":
        return (
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              Your Certificates
            </h2>
            <p className="text-slate-600">
              Download and view certificates for completed courses.
            </p>
          </div>
        );
      case "referrals":
        return (
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              Referral Program
            </h2>
            <p className="text-slate-600">
              Share your link with friends to earn rewards.
            </p>
          </div>
        );
      case "payment":
        return (
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              Payment History
            </h2>
            <p className="text-slate-600">
              View your billing history and subscription details.
            </p>
          </div>
        );
      default:
        return children;
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col border-4 border-indigo-200 box-border overflow-hidden bg-slate-50">
      {/* Header with Login & Sign up buttons */}
      <Header
        isLoggedIn={isLoggedIn}
        onLoginClick={handleLogin}
        onSignupClick={handleSignup}
        onLogoutClick={handleLogout}
        onMyCourseClick={() => setActiveTab("courses")}
      />

      <div className="flex flex-grow overflow-hidden">
        {/* Sidebar is only visible when logged in */}
        {isLoggedIn && (
          <Sidebar
            userName={userName}
            setUserName={setUserName}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        )}

        <main className="flex-grow p-6 overflow-y-auto flex flex-col gap-6 items-center justify-center">
          {isLoggedIn ? (
            <div className="w-full h-full flex flex-col gap-6">
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

              <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-sm flex-grow">
                {renderTabContent()}
              </div>
            </div>
          ) : (
            <div className="text-center flex flex-col items-center gap-3">
              <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">
                Welcome to E-learners Hub
              </h1>
              <p className="text-slate-500 max-w-md">
                Please log in or sign up using the top-right buttons to explore
                your courses, tasks, and certificates.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Footer stays persistent */}
      <Footer />
    </div>
  );
}
