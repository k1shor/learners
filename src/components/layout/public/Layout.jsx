import { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("John Doe");
  const [activeTab, setActiveTab] = useState("courses");
  const [selectedCourse, setSelectedCourse] = useState(null); // State for the popup modal

  // Available courses dataset
  const coursesData = [
    {
      Title: "Introduction to React",
      "Course-Code": "CS101",
      Instructor: "Dr. Jane Smith",
      Duration: "8 Weeks",
      Time: "10:00 AM - 11:30 AM",
      "Start-date": "Nov 1, 2026",
    },
    {
      Title: "Advanced JavaScript",
      "Course-Code": "CS201",
      Instructor: "Prof. John Doe",
      Duration: "6 Weeks",
      Time: "2:00 PM - 3:30 PM",
      "Start-date": "Nov 5, 2026",
    },
    {
      Title: "UI/UX Design Fundamentals",
      "Course-Code": "DS105",
      Instructor: "Sarah Jenkins",
      Duration: "4 Weeks",
      Time: "11:00 AM - 12:30 PM",
      "Start-date": "Nov 10, 2026",
    },
    {
      Title: "Full-Stack Web Development",
      "Course-Code": "CS301",
      Instructor: "Alex Rivera",
      Duration: "12 Weeks",
      Time: "1:00 PM - 3:00 PM",
      "Start-date": "Nov 15, 2026",
    },
    {
      Title: "Database Management Systems",
      "Course-Code": "CS202",
      Instructor: "Dr. Emily Chen",
      Duration: "10 Weeks",
      Time: "9:00 AM - 10:30 AM",
      "Start-date": "Nov 20, 2026",
    },
  ];

  const handleLogin = () => setIsLoggedIn(true);
  const handleSignup = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  const renderTabContent = () => {
    switch (activeTab) {
      case "courses":
        return (
          <div className="flex flex-col flex-1 gap-4">
            <h2 className="text-xl font-bold text-slate-800">
              Available Courses
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {coursesData.map((course, index) => (
                <div
                  key={index}
                  className="bg-slate-50 border border-indigo-200 p-4 rounded-lg shadow-sm flex flex-col justify-between gap-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-bold text-indigo-900 text-lg leading-snug">
                        {course.Title}
                      </h3>
                      <span className="text-xs bg-indigo-100 text-indigo-700 font-semibold px-2 py-1 rounded shrink-0">
                        {course["Course-Code"]}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 text-sm text-slate-600 mt-1">
                      <p> Instructor: {course.Instructor}</p>
                      <p> Duration: {course.Duration}</p>
                      <p> Time: {course.Time}</p>
                      <p> Start Date: {course["Start-date"]}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCourse(course)}
                    className="w-full mt-2 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer shadow-sm"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      case "tasks":
        return (
          <div className="flex flex-col flex-1">
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
          <div className="flex flex-col flex-1">
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
          <div className="flex flex-col flex-1">
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
          <div className="flex flex-col flex-1">
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
    <div className="w-screen h-screen flex flex-col border-4 border-indigo-200 box-border overflow-hidden bg-slate-50 relative">
      <Header
        isLoggedIn={isLoggedIn}
        onLoginClick={handleLogin}
        onSignupClick={handleSignup}
        onLogoutClick={handleLogout}
        onMyCourseClick={() => setActiveTab("courses")}
      />

      <div className="flex flex-1 overflow-hidden">
        {isLoggedIn && (
          <Sidebar
            userName={userName}
            setUserName={setUserName}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        )}

        <main className="flex-1 p-6 overflow-y-auto flex flex-col gap-6">
          {isLoggedIn ? (
            <div className="flex flex-col flex-1 gap-6 min-h-full">
              <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-sm flex items-center justify-between shrink-0">
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">
                    Welcome, {userName}! 👋
                  </h1>
                  <p className="text-sm text-slate-500 mt-1">
                    Here is what's happening with your learning journey today.
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-sm flex flex-col flex-1">
                {renderTabContent()}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
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

      <Footer />

      {/* Course Details Popup Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-indigo-200 shadow-2xl p-6 max-w-md w-full flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs bg-indigo-100 text-indigo-700 font-semibold px-2.5 py-1 rounded">
                  {selectedCourse["Course-Code"]}
                </span>
                <h3 className="text-xl font-bold text-indigo-900 mt-2">
                  {selectedCourse.Title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-2.5 text-sm text-slate-600 border-y border-indigo-50 py-4">
              <p>
                <strong> Instructor:</strong> {selectedCourse.Instructor}
              </p>
              <p>
                <strong> Duration:</strong> {selectedCourse.Duration}
              </p>
              <p>
                <strong> Time:</strong> {selectedCourse.Time}
              </p>
              <p>
                <strong> Start Date:</strong> {selectedCourse["Start-date"]}
              </p>
            </div>

            <button
              onClick={() => setSelectedCourse(null)}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl text-sm transition-colors cursor-pointer shadow-sm"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
