import { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import ReferralPage from "../../../pages/student/ReferralPage";
import PaymentPage from "../../../pages/student/PaymentPage";
import CoursesPage from "../../../pages/student/CoursesPage";
import TasksPage from "../../../pages/student/TasksPage";
import CertificatesPage from "../../../pages/student/CertificatesPage";
import FilesPage from "../../../pages/student/FilesPage";
import TeacherPage from "../../../pages/teachers/TeacherPage";
import { authenticateTeacher } from "../../../pages/teachers/teacherAccounts";
import { coursesData } from "../../../pages/student/coursesData";
import { getDisabledCourseCodes } from "../../../pages/student/courseAvailability";
import {
  getJoinedCourseCodes,
  joinStudentToCourse,
} from "../../../pages/student/studentEnrollments";

const getStudentId = (email, name) =>
  email.trim().toLowerCase() || name.trim().toLowerCase();

const loadEnrollmentState = (studentId) => {
  try {
    return {
      studentId,
      courseCodes: getJoinedCourseCodes(studentId),
      error: "",
    };
  } catch (error) {
    return {
      studentId,
      courseCodes: [],
      error:
        error instanceof Error
          ? error.message
          : "Unable to load your joined courses.",
    };
  }
};

export default function Layout({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("John Doe");
  const [activeTab, setActiveTab] = useState("courses");
  const [tabVersion, setTabVersion] = useState(0);
  const [loginRole, setLoginRole] = useState("student");
  const [teacherCourseCodes, setTeacherCourseCodes] = useState([]);
  const [files, setFiles] = useState([]);
  const [courseAccess] = useState(() => {
    try {
      return { disabledCourseCodes: getDisabledCourseCodes(), error: "" };
    } catch (error) {
      return {
        disabledCourseCodes: coursesData.map((course) => course["Course-Code"]),
        error:
          error instanceof Error
            ? error.message
            : "Unable to load course availability.",
      };
    }
  });
  const studentCourses = coursesData.map((course) => ({
    ...course,
    enabled: !courseAccess.disabledCourseCodes.includes(course["Course-Code"]),
  }));
  const availableCourses = studentCourses.filter((course) => course.enabled);

  // Authentication Modal States
  const [authModal, setAuthModal] = useState(null); // 'login' | 'signup' | null
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [enrollmentState, setEnrollmentState] = useState(() =>
    loadEnrollmentState("john doe"),
  );
  const studentId = getStudentId(loginEmail, userName);
  const isCurrentEnrollment = enrollmentState.studentId === studentId;
  const joinedCourseCodes = isCurrentEnrollment
    ? enrollmentState.courseCodes
    : [];
  const joinedCourses = availableCourses.filter((course) =>
    joinedCourseCodes.includes(course["Course-Code"]),
  );

  // Available courses dataset


  // Auth Handlers
  const handleOpenLogin = () => setAuthModal("login");
  const handleOpenSignup = () => setAuthModal("signup");
  const handleCloseAuth = () => setAuthModal(null);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError("");

    if (loginRole === "teacher") {
      let teacher;
      try {
        teacher = authenticateTeacher(loginEmail, loginPassword);
      } catch (error) {
        setLoginError(
          error instanceof Error
            ? error.message
            : "Unable to read teacher accounts. Please contact the admin.",
        );
        return;
      }

      if (!teacher) {
        setLoginError(
          "No matching teacher account. Ask the admin to create your account.",
        );
        return;
      }

      setUserName(teacher.name);
      setTeacherCourseCodes(teacher.courseCodes ?? []);
      setIsLoggedIn(true);
      setAuthModal(null);
      setLoginPassword("");
      return;
    }

    let nextUserName = userName;
    if (loginEmail.trim()) {
      const emailName = loginEmail
        .split("@")[0]
        .split(/[._-]+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
      const roleName = loginRole === "teacher" ? "Teacher" : "Student";
      nextUserName = ["student", "teacher"].includes(emailName.toLowerCase())
        ? roleName
        : emailName;
      setUserName(nextUserName);
    }
    setEnrollmentState(loadEnrollmentState(getStudentId(loginEmail, nextUserName)));
    setIsLoggedIn(true);
    setAuthModal(null);
    setLoginPassword("");
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    const nextUserName = signupName.trim() || userName;
    const studentEmail = signupEmail.trim().toLowerCase();
    setUserName(nextUserName);
    setLoginEmail(studentEmail);
    setEnrollmentState(
      loadEnrollmentState(getStudentId(studentEmail, nextUserName)),
    );
    setLoginRole("student");
    setIsLoggedIn(true);
    setAuthModal(null);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginRole("student");
    setTeacherCourseCodes([]);
    setFiles([]);
    setLoginError("");
    setLoginEmail("");
  };

  const handleJoinCourse = (courseCode) => {
    try {
      setEnrollmentState({
        studentId,
        courseCodes: joinStudentToCourse(studentId, courseCode),
        error: "",
      });
    } catch (error) {
      setEnrollmentState((current) => ({
        studentId,
        courseCodes: isCurrentEnrollment ? current.courseCodes : [],
        error:
          error instanceof Error
            ? error.message
            : "Unable to join this course.",
      }));
    }
  };

  const handlePrepareCertificateDownload = (course) => {
    const certificateId = `certificate-${course["Course-Code"]}`;
    const file = {
      id: certificateId,
      name: `${course["Course-Code"]}-certificate.txt`,
      course: course.Title,
      content: [
        "E-learners Hub - Certificate of Completion",
        `Presented to: ${userName}`,
        `Course: ${course.Title}`,
        `Course code: ${course["Course-Code"]}`,
        `Instructor: ${course.Instructor}`,
        "Issued date: October 2026",
        `Credential ID: ELH-${course["Course-Code"]}-2026`,
      ].join("\n"),
    };

    setFiles((currentFiles) => [
      file,
      ...currentFiles.filter((item) => item.id !== certificateId),
    ]);
    setActiveTab("files");
    setTabVersion((version) => version + 1);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "courses":
        return (
          <CoursesPage
            courses={studentCourses}
            viewMode="catalog"
            joinedCourseCodes={joinedCourseCodes}
            onJoinCourse={handleJoinCourse}
            enrollmentError={isCurrentEnrollment ? enrollmentState.error : ""}
            userName={userName}
            userEmail={loginEmail}
            availabilityError={courseAccess.error}
          />
        );
      case "myCourses":
        return (
          <CoursesPage
            courses={joinedCourses}
            viewMode="joined"
            joinedCourseCodes={joinedCourseCodes}
            userName={userName}
            userEmail={loginEmail}
            enrollmentError={isCurrentEnrollment ? enrollmentState.error : ""}
            availabilityError={courseAccess.error}
            onBrowseCourses={() => setActiveTab("courses")}
          />
        );
      case "tasks":
        return (
          <TasksPage
            courses={joinedCourses}
            userName={userName}
            userEmail={loginEmail}
          />
        );
      case "certificates":
        return (
          <CertificatesPage
            courses={joinedCourses}
            userName={userName}
            onPrepareDownload={handlePrepareCertificateDownload}
          />
        );
      case "files":
        return <FilesPage files={files} />;
      case "referrals":
        return <ReferralPage userName={userName} />;
      case "payment":
        return <PaymentPage userName={userName} />;
      default:
        return children;
    }
  };

  if (isLoggedIn && loginRole === "teacher") {
    return (
      <TeacherPage
        userName={userName}
        userEmail={loginEmail.trim().toLowerCase()}
        courseCodes={teacherCourseCodes}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="app-frame relative flex h-screen w-full flex-col overflow-hidden bg-slate-50">
      <Header
        isLoggedIn={isLoggedIn}
        onLoginClick={handleOpenLogin}
        onSignupClick={handleOpenSignup}
        onLogoutClick={handleLogout}
        onMyCourseClick={() => {
          setActiveTab("myCourses");
          setTabVersion((version) => version + 1);
        }}
      />

      <div className="app-workspace flex flex-1 overflow-hidden md:flex-row">
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

        <main className="flex min-w-0 flex-1 flex-col gap-5 overflow-y-auto p-4 sm:gap-6 sm:p-6 lg:p-8">
          {isLoggedIn ? (
            <div className="flex flex-col flex-1 gap-6 min-h-full">
              <div className="flex shrink-0 items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                <div>
                  <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-indigo-600">
                    Your learning space
                  </p>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]">
                    Welcome back, {userName}
                  </h1>
                  <p className="mt-1 text-sm text-slate-500">
                    Here is what's happening with your learning journey today.
                  </p>
                </div>
                <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 sm:flex">
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3 14.8 8.7 21 9.6l-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
                  </svg>
                </div>
              </div>

              <div className="app-content-panel flex flex-1 flex-col rounded-2xl border bg-white p-4 sm:p-6">
                <div key={tabVersion} className="flex flex-1 flex-col">
                  {renderTabContent()}
                </div>
              </div>
            </div>
          ) : (
              <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-6 py-6 sm:gap-8 sm:py-10">
                <section className="welcome-hero relative isolate overflow-hidden rounded-[2rem] px-6 py-10 text-white sm:px-10 sm:py-14 lg:px-14 lg:py-16">
                  <div aria-hidden="true" className="welcome-decoration absolute -right-20 -top-24 -z-10 h-80 w-80 rounded-full border-[34px] border-white/10" />
                  <div aria-hidden="true" className="absolute -bottom-28 right-1/4 -z-10 h-64 w-64 rounded-full bg-violet-300/20 blur-3xl" />
                  <div className="relative max-w-2xl">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-indigo-50 backdrop-blur">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                      YOUR NEXT CHAPTER STARTS HERE
                    </span>
                    <h1 className="mt-6 text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                      Learn at your pace.
                      <span className="mt-1 block text-indigo-200">Grow on your terms.</span>
                    </h1>
                    <p className="mt-5 max-w-xl text-sm leading-6 text-indigo-100 sm:text-base sm:leading-7">
                      Build practical skills with expert-led courses, stay on top of your assignments, and celebrate every milestone along the way.
                    </p>
                    <div className="mt-8 flex flex-wrap items-center gap-3">
                      <button
                        onClick={handleOpenSignup}
                        className="cursor-pointer rounded-xl bg-white px-5 py-3 text-sm font-bold text-indigo-800 shadow-lg shadow-indigo-950/15 transition hover:-translate-y-0.5 hover:bg-indigo-50"
                      >
                        Get started
                        <span aria-hidden="true" className="ml-2">→</span>
                      </button>
                      <button
                        onClick={handleOpenLogin}
                        className="cursor-pointer rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
                      >
                        Log in to your account
                      </button>
                    </div>
                    <div className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-indigo-100">
                      <span className="flex items-center gap-2"><span className="text-emerald-300">✓</span> Learn from anywhere</span>
                      <span className="flex items-center gap-2"><span className="text-emerald-300">✓</span> Track your progress</span>
                      <span className="flex items-center gap-2"><span className="text-emerald-300">✓</span> Earn certificates</span>
                    </div>
                  </div>
                  <div aria-hidden="true" className="absolute bottom-8 right-10 hidden w-64 rotate-2 rounded-2xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-md lg:block">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-indigo-100">A little progress, every day</span>
                      <span className="text-lg">✦</span>
                    </div>
                    <div className="mt-5 flex items-end gap-2">
                      <span className="h-8 flex-1 rounded-t-md bg-white/35" />
                      <span className="h-12 flex-1 rounded-t-md bg-white/45" />
                      <span className="h-10 flex-1 rounded-t-md bg-white/35" />
                      <span className="h-16 flex-1 rounded-t-md bg-white/70" />
                      <span className="h-20 flex-1 rounded-t-md bg-white" />
                    </div>
                    <div className="mt-2 flex justify-between text-[10px] text-indigo-100">
                      <span>START</span>
                      <span>KEEP GOING</span>
                      <span>ACHIEVE</span>
                    </div>
                  </div>
                </section>

                <section aria-label="Platform benefits" className="grid gap-4 sm:grid-cols-3">
                  {[
                    { number: "01", title: "Learn something new", detail: "Explore structured courses built to help you grow." },
                    { number: "02", title: "Stay on track", detail: "Keep lessons and assignments organized in one place." },
                    { number: "03", title: "Celebrate progress", detail: "See your achievements and save your certificates." },
                  ].map((item) => (
                    <article key={item.number} className="border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                      <span className="text-xs font-bold tracking-[0.14em] text-indigo-500">{item.number}</span>
                      <h2 className="mt-3 text-base font-bold text-slate-900">{item.title}</h2>
                      <p className="mt-1.5 text-sm leading-6 text-slate-500">{item.detail}</p>
                    </article>
                  ))}
                </section>
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
                      onClick={() => {
                        setLoginRole(role);
                        setLoginError("");
                      }}
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
                  placeholder={`${loginRole}@example.com`}
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
              {loginRole === "teacher" && (
                <p className="text-xs leading-5 text-slate-500">
                  Teacher accounts are created by the admin. Use the email and
                  temporary password they provided.
                </p>
              )}
              {loginError && (
                <p role="alert" className="text-sm text-rose-600">
                  {loginError}
                </p>
              )}
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
