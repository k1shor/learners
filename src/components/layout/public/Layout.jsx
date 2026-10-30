import { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import ReferralPage from "../../../pages/student/ReferralPage";
import PaymentPage from "../../../pages/student/PaymentPage";
import CoursesPage from "../../../pages/student/CoursesPage";
import TasksPage from "../../../pages/student/TasksPage";
import CertificatesPage from "../../../pages/student/CertificatesPage";
import { coursesData } from "../../../pages/student/coursesData";

export default function Layout({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("John Doe");
  const [activeTab, setActiveTab] = useState("courses");
  const [tabVersion, setTabVersion] = useState(0);
  const [loginRole, setLoginRole] = useState("student");

  // Authentication Modal States
  const [authModal, setAuthModal] = useState(null); // 'login' | 'signup' | null
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  // Available courses dataset


  // Auth Handlers
  const handleOpenLogin = () => setAuthModal("login");
  const handleOpenSignup = () => setAuthModal("signup");
  const handleCloseAuth = () => setAuthModal(null);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginEmail.trim()) {
      // Set username based on email prefix if not provided
      const extractedName = loginEmail.split("@")[0];
      setUserName(
        extractedName.charAt(0).toUpperCase() + extractedName.slice(1),
      );
    }
    setIsLoggedIn(true);
    setAuthModal(null);
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (signupName.trim()) {
      setUserName(signupName);
    }
    setLoginRole("student");
    setIsLoggedIn(true);
    setAuthModal(null);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginRole("student");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "courses":
        return <CoursesPage courses={coursesData} />;
      case "tasks":
        return <TasksPage courses={coursesData} />;
      case "certificates":
        return <CertificatesPage courses={coursesData} userName={userName} />;
      case "referrals":
        return <ReferralPage userName={userName} />;
      case "payment":
        return <PaymentPage userName={userName} />;
      default:
        return children;
    }
  };

  if (isLoggedIn && loginRole === "teacher") {
    return null;
  }

  return (
    <div className="w-screen h-screen flex flex-col border-4 border-indigo-200 box-border overflow-hidden bg-slate-50 relative">
      <Header
        isLoggedIn={isLoggedIn}
        onLoginClick={handleOpenLogin}
        onSignupClick={handleOpenSignup}
        onLogoutClick={handleLogout}
        onMyCourseClick={() => {
          setActiveTab("courses");
          setTabVersion((version) => version + 1);
        }}
      />

      <div className="flex flex-1 overflow-hidden">
        {isLoggedIn && (
          <Sidebar
            userName={userName}
            setUserName={setUserName}
            activeTab={activeTab}
            setActiveTab={(tab) => {
              setActiveTab(tab);
              setTabVersion((version) => version + 1);
            }}
          />
        )}

        <main className="flex-1 p-6 overflow-y-auto flex flex-col gap-6">
          {isLoggedIn ? (
            <div className="flex flex-col flex-1 gap-6 min-h-full">
              {/* Top Greeting Bar */}
              <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-sm flex items-center justify-between shrink-0">
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">
                    Welcome, {userName}!
                  </h1>
                  <p className="text-sm text-slate-500 mt-1">
                    Here is what's happening with your learning journey today.
                  </p>
                </div>
              </div>

              {/* Dynamic Content Area */}
              <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-sm flex flex-col flex-1">
                <div key={tabVersion} className="flex flex-1 flex-col">
                  {renderTabContent()}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-12">
              <div className="flex flex-col items-center gap-2 max-w-md">
                <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                  Welcome to E-learners Hub
                </h1>
                <p className="text-slate-500 text-sm">
                  Please log in or create an account using the buttons above to
                  explore your courses, manage tasks, and view earned
                  certificates.
                </p>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={handleOpenLogin}
                  className="py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm transition-colors cursor-pointer shadow-sm"
                >
                  Log In
                </button>
                <button
                  onClick={handleOpenSignup}
                  className="py-2.5 px-6 bg-white hover:bg-indigo-50 text-indigo-600 border border-indigo-200 font-medium rounded-lg text-sm transition-colors cursor-pointer shadow-sm"
                >
                  Sign Up
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Login Modal */}
      {authModal === "login" && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-indigo-100 shadow-xl w-full max-w-md p-6 flex flex-col gap-5">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-xl font-bold text-slate-800">
                Log In to E-learners Hub
              </h3>
              <button
                onClick={handleCloseAuth}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
              <fieldset>
                <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Log in as
                </legend>
                <div className="grid grid-cols-2 gap-2">
                  {["student", "teacher"].map((role) => (
                    <button
                      key={role}
                      type="button"
                      aria-pressed={loginRole === role}
                      onClick={() => setLoginRole(role)}
                      className={`rounded-lg border px-3 py-2.5 text-sm font-semibold capitalize transition-colors ${
                        loginRole === role
                          ? "border-indigo-600 bg-indigo-50 text-indigo-800"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </fieldset>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-indigo-500"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm transition-colors cursor-pointer shadow-sm mt-2"
              >
                Log In
              </button>
            </form>
            <p className="text-xs text-center text-slate-500 border-t border-slate-100 pt-3">
              Don't have an account?{" "}
              <button
                onClick={() => setAuthModal("signup")}
                className="text-indigo-600 font-semibold hover:underline cursor-pointer"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {authModal === "signup" && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-indigo-100 shadow-xl w-full max-w-md p-6 flex flex-col gap-5">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-xl font-bold text-slate-800">
                Create your Account
              </h3>
              <button
                onClick={handleCloseAuth}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSignupSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-indigo-500"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-indigo-500"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm transition-colors cursor-pointer shadow-sm mt-2"
              >
                Sign Up
              </button>
            </form>
            <p className="text-xs text-center text-slate-500 border-t border-slate-100 pt-3">
              Already have an account?{" "}
              <button
                onClick={() => setAuthModal("login")}
                className="text-indigo-600 font-semibold hover:underline cursor-pointer"
              >
                Log In
              </button>
            </p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
