import { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("John Doe");
  const [activeTab, setActiveTab] = useState("courses");
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Interactive inline state for the active view
  const [activeVideo, setActiveVideo] = useState(null);
  const [activeSyllabus, setActiveSyllabus] = useState(null);
  const [activeAssignment, setActiveAssignment] = useState(null);

  // Available courses dataset with populated avatar URLs matching each participant
  const coursesData = [
    {
      Title: "Introduction to React",
      "Course-Code": "CS101",
      Instructor: "Dr. Jane Smith",
      Duration: "8 Weeks",
      Time: "10:00 AM - 11:30 AM",
      "Start-date": "Nov 1, 2026",
      Description:
        "Master the fundamentals of React, including components, props, state management, and hooks to build modern web applications.",
      Materials: "React Cheatsheet, Starter Files, Slide Decks",
      videos: [
        {
          title: "Day 1: Introduction & Environment Setup",
          duration: "45 mins",
          content:
            "Overview of React ecosystem, Node setup, and building the first component structure.",
        },
        {
          title: "Day 2: Components and Props",
          duration: "60 mins",
          content:
            "Learning how to pass data cleanly between parent and child components using props.",
        },
        {
          title: "Day 3: State and Lifecycle Hooks",
          duration: "55 mins",
          content:
            "Managing internal component state using the useState hook and understanding renders.",
        },
        {
          title: "Day 4: Handling Events and Forms",
          duration: "50 mins",
          content:
            "Managing user inputs, controlled components, and form submissions.",
        },
      ],
      syllabus: [
        {
          title: "Module 1: Foundations & JSX Architecture",
          desc: "Understanding the virtual DOM and setting up Vite.",
        },
        {
          title: "Module 2: Props, State & Event Handling",
          desc: "Managing component states and passing data securely.",
        },
        {
          title: "Module 3: Hooks & Side Effects",
          desc: "Mastering useEffect, useRef, and custom hooks.",
        },
      ],
      assignments: [
        {
          title: "Assignment 1: Component Tree Design",
          dueDate: "End of Week 2",
          details:
            "Create a multi-component layout replicating a dashboard interface.",
        },
        {
          title: "Assignment 2: Counter & State Tracker",
          dueDate: "End of Week 4",
          details:
            "Build an interactive tracker using useState with persistent local storage.",
        },
      ],
      participants: [
        {
          name: "Alice Smith",
          role: "Student",
          avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
        },
        {
          name: "Bob Jones",
          role: "Student",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        },
        {
          name: "Charlie Brown",
          role: "Student",
          avatar:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
        },
      ],
    },
    {
      Title: "Advanced JavaScript",
      "Course-Code": "CS201",
      Instructor: "Prof. John Doe",
      Duration: "6 Weeks",
      Time: "2:00 PM - 3:30 PM",
      "Start-date": "Nov 5, 2026",
      Description:
        "Deep dive into asynchronous JavaScript, closures, prototypes, ES6+ features, and modern performance optimization techniques.",
      Materials: "JS Handbook, Code Snippets Repository",
      videos: [
        {
          title: "Day 1: Asynchronous JS & Callbacks",
          duration: "50 mins",
          content:
            "Understanding the event loop, call stack, and asynchronous callback patterns.",
        },
        {
          title: "Day 2: Promises and Async/Await",
          duration: "65 mins",
          content:
            "Writing clean asynchronous code handling network fetch calls and error handling.",
        },
        {
          title: "Day 3: Closures and Prototypes",
          duration: "40 mins",
          content:
            "Deep inspection of lexical scoping, scope chains, and prototype inheritance.",
        },
        {
          title: "Day 4: Performance Optimization",
          duration: "60 mins",
          content:
            "Memory leaks, debouncing, throttling, and execution profiling.",
        },
      ],
      syllabus: [
        {
          title: "Module 1: Advanced Execution Contexts",
          desc: "Lexical scoping, scope chains, and closures.",
        },
        {
          title: "Module 2: Asynchronous Programming Patterns",
          desc: "Handling network requests and error boundaries.",
        },
        {
          title: "Module 3: ES6+ Modern Features",
          desc: "Destructuring, spread operators, and modules.",
        },
      ],
      assignments: [
        {
          title: "Assignment 1: Custom Promise Implementation",
          dueDate: "End of Week 2",
          details:
            "Recreate a basic version of JavaScript Promises from scratch.",
        },
        {
          title: "Assignment 2: Event Loop Analyzer",
          dueDate: "End of Week 5",
          details:
            "Analyze complex synchronous/asynchronous output execution flows.",
        },
      ],
      participants: [
        {
          name: "Diana Prince",
          role: "Student",
          avatar:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        },
        {
          name: "Evan Wright",
          role: "Student",
          avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        },
      ],
    },
    {
      Title: "UI/UX Design Fundamentals",
      "Course-Code": "DS105",
      Instructor: "Sarah Jenkins",
      Duration: "4 Weeks",
      Time: "11:00 AM - 12:30 PM",
      "Start-date": "Nov 10, 2026",
      Description:
        "Learn user research, wireframing, prototyping principles, and design systems using industry-standard tools.",
      Materials: "Figma UI Kit, Design Workbook",
      videos: [
        {
          title: "Day 1: User Research & Persona Creation",
          duration: "40 mins",
          content:
            "Conducting qualitative interviews and mapping target user archetypes.",
        },
        {
          title: "Day 2: Wireframing Basics",
          duration: "50 mins",
          content:
            "Drafting rapid low-fidelity layout wireframes to test structural flows.",
        },
        {
          title: "Day 3: Prototyping Principles",
          duration: "45 mins",
          content:
            "Adding interactive transitions and screen flows in design software.",
        },
        {
          title: "Day 4: Design Systems & Handoff",
          duration: "55 mins",
          content:
            "Structuring component token systems for developer design handoff.",
        },
      ],
      syllabus: [
        {
          title: "Module 1: User-Centered Design Principles",
          desc: "Empathy mapping and target audience analysis.",
        },
        {
          title: "Module 2: Wireframing & Low-Fi Prototyping",
          desc: "Translating ideas into layout drafts.",
        },
        {
          title: "Module 3: High-Fi UI Design Systems",
          desc: "Creating reusable components and style guides.",
        },
      ],
      assignments: [
        {
          title: "Assignment 1: Mobile Wireframe Flow",
          dueDate: "End of Week 2",
          details:
            "Design a 5-screen mobile application wireframe user journey.",
        },
      ],
      participants: [
        {
          name: "Fiona Gallagher",
          role: "Student",
          avatar:
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
        },
        {
          name: "George Clark",
          role: "Student",
          avatar:
            "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
        },
        {
          name: "Hannah Abbott",
          role: "Student",
          avatar:
            "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
        },
      ],
    },
    {
      Title: "Full-Stack Web Development",
      "Course-Code": "CS301",
      Instructor: "Alex Rivera",
      Duration: "12 Weeks",
      Time: "1:00 PM - 3:00 PM",
      "Start-date": "Nov 15, 2026",
      Description:
        "Build complete end-to-end web applications combining Node.js, Express, databases, and frontend frameworks.",
      Materials: "API Documentation, Postman Collection, Boilerplate Code",
      videos: [
        {
          title: "Day 1: Node.js & Express Setup",
          duration: "60 mins",
          content:
            "Initializing an Express backend server with routing middleware.",
        },
        {
          title: "Day 2: RESTful API Development",
          duration: "75 mins",
          content: "Implementing complete CRUD operations securely.",
        },
        {
          title: "Day 3: Connecting Databases",
          duration: "60 mins",
          content:
            "Integrating persistent database connections with query logic.",
        },
        {
          title: "Day 4: Authentication & Security",
          duration: "90 mins",
          content: "Securing endpoints using JWT tokens and password hashing.",
        },
      ],
      syllabus: [
        {
          title: "Module 1: Backend Architecture with Node.js",
          desc: "Building fast servers using Express middleware.",
        },
        {
          title: "Module 2: Database Integration & Queries",
          desc: "Connecting relational databases to server routes.",
        },
        {
          title: "Module 3: Full-Stack Integration & Deployment",
          desc: "Securing routes with JWT and deploying apps.",
        },
      ],
      assignments: [
        {
          title: "Assignment 1: REST API Build",
          dueDate: "End of Week 4",
          details: "Develop a fully functional product catalog backend API.",
        },
      ],
      participants: [
        {
          name: "Ian Malcolm",
          role: "Student",
          avatar:
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
        },
        {
          name: "Julia Roberts",
          role: "Student",
          avatar:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
        },
      ],
    },
    {
      Title: "Database Management Systems",
      "Course-Code": "CS202",
      Instructor: "Dr. Emily Chen",
      Duration: "10 Weeks",
      Time: "9:00 AM - 10:30 AM",
      "Start-date": "Nov 20, 2026",
      Description:
        "Understand relational database design, SQL querying, indexing, normalization, and NoSQL fundamentals.",
      Materials: "SQL Query Reference Guide, Schema Diagrams",
      videos: [
        {
          title: "Day 1: Relational Model & ER Diagrams",
          duration: "45 mins",
          content:
            "Mapping out entity sets, relationships, and structural keys.",
        },
        {
          title: "Day 2: Basic & Advanced SQL Queries",
          duration: "60 mins",
          content:
            "Writing complex multi-table JOIN statements and aggregate groupings.",
        },
        {
          title: "Day 3: Normalization & Indexing",
          duration: "50 mins",
          content:
            "Eliminating redundancy through 1NF, 2NF, and 3NF normalization rules.",
        },
        {
          title: "Day 4: NoSQL Introduction",
          duration: "55 mins",
          content: "Introduction to unstructured document collections.",
        },
      ],
      syllabus: [
        {
          title: "Module 1: Relational Database Design",
          desc: "Entity relationships and primary/foreign keys.",
        },
        {
          title: "Module 2: Advanced SQL & Optimization",
          desc: "Joins, subqueries, aggregations, and performance indexing.",
        },
        {
          title: "Module 3: NoSQL Database Systems",
          desc: "Document-based stores and unstructured data handling.",
        },
      ],
      assignments: [
        {
          title: "Assignment 1: Schema Normalization Task",
          dueDate: "End of Week 3",
          details:
            "Normalize an unformatted transactional table database up to 3NF.",
        },
      ],
      participants: [
        {
          name: "Kevin Bacon",
          role: "Student",
          avatar:
            "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150",
        },
        {
          name: "Laura Croft",
          role: "Student",
          avatar:
            "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
        },
        {
          name: "Michael Scott",
          role: "Student",
          avatar:
            "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150",
        },
      ],
    },
  ];

  const handleLogin = () => setIsLoggedIn(true);
  const handleSignup = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
    setActiveVideo(null);
    setActiveSyllabus(null);
    setActiveAssignment(null);
  };

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
                      <p>Instructor: {course.Instructor}</p>
                      <p>Duration: {course.Duration}</p>
                      <p>Time: {course.Time}</p>
                      <p>Start Date: {course["Start-date"]}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSelectCourse(course)}
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
    <div className="w-screen h-screen flex flex-col border-4 border-indigo-200 box-border overflow-hidden bg-slate-50">
      <Header
        isLoggedIn={isLoggedIn}
        onLoginClick={handleLogin}
        onSignupClick={handleSignup}
        onLogoutClick={handleLogout}
        onMyCourseClick={() => {
          setSelectedCourse(null);
          setActiveTab("courses");
        }}
      />

      <div className="flex flex-1 overflow-hidden">
        {isLoggedIn && (
          <Sidebar
            userName={userName}
            setUserName={setUserName}
            activeTab={activeTab}
            setActiveTab={(tab) => {
              setSelectedCourse(null);
              setActiveTab(tab);
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
                {selectedCourse ? (
                  <div className="flex flex-col gap-6">
                    {/* Back Button */}
                    <div>
                      <button
                        onClick={() => setSelectedCourse(null)}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
                      >
                        ← Back to Courses
                      </button>
                    </div>

                    {/* Main Layout: Left Content & Right Participants Sidebar */}
                    <div className="flex flex-col lg:flex-row gap-6 items-start">
                      {/* Left Column: Course Details */}
                      <div className="flex-1 flex flex-col gap-6 w-full">
                        {/* Header Info */}
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-3">
                            <span className="text-xs bg-indigo-100 text-indigo-700 font-semibold px-2.5 py-1 rounded">
                              {selectedCourse["Course-Code"]}
                            </span>
                          </div>
                          <h2 className="text-2xl font-bold text-indigo-900">
                            {selectedCourse.Title}
                          </h2>
                          <p className="text-slate-600 text-base leading-relaxed">
                            {selectedCourse.Description}
                          </p>
                        </div>

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 border border-indigo-100 p-4 rounded-xl">
                          <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                              Instructor
                            </span>
                            <p className="text-slate-700 font-medium mt-0.5">
                              {selectedCourse.Instructor}
                            </p>
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                              Duration
                            </span>
                            <p className="text-slate-700 font-medium mt-0.5">
                              {selectedCourse.Duration}
                            </p>
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                              Start Time & Date
                            </span>
                            <p className="text-slate-700 font-medium mt-0.5">
                              {selectedCourse["Start-date"]} (
                              {selectedCourse.Time})
                            </p>
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                              Materials Included
                            </span>
                            <p className="text-slate-700 font-medium mt-0.5">
                              {selectedCourse.Materials}
                            </p>
                          </div>
                        </div>

                        {/* Dropdown: Videos List */}
                        <details className="group bg-slate-50 border border-indigo-100 rounded-xl p-4 cursor-pointer">
                          <summary className="font-bold text-indigo-900 flex justify-between items-center select-none">
                            <span>Course Videos</span>
                            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded group-open:rotate-180 transition-transform">
                              ▼
                            </span>
                          </summary>
                          <div className="mt-3 flex flex-col gap-2 pt-3 border-t border-indigo-100">
                            {selectedCourse.videos.map((video, vIdx) => (
                              <div
                                key={vIdx}
                                className="flex flex-col bg-white rounded border border-slate-200 overflow-hidden"
                              >
                                <div
                                  onClick={() =>
                                    setActiveVideo(
                                      activeVideo === vIdx ? null : vIdx,
                                    )
                                  }
                                  className="p-3 flex justify-between items-center hover:bg-slate-50 cursor-pointer"
                                >
                                  <span className="font-medium text-sm text-slate-800">
                                    {video.title}
                                  </span>
                                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                                    {video.duration}
                                  </span>
                                </div>
                                {activeVideo === vIdx && (
                                  <div className="p-3 bg-indigo-50/50 border-t border-indigo-100 text-xs text-slate-600 flex justify-between items-center">
                                    <p>
                                      <strong>Lesson Preview Overview:</strong>{" "}
                                      {video.content}
                                    </p>
                                    <button
                                      onClick={() =>
                                        alert(`Playing video: ${video.title}`)
                                      }
                                      className="py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium transition-colors cursor-pointer shrink-0 ml-4"
                                    >
                                      Play
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </details>

                        {/* Dropdown: Syllabus List */}
                        <details className="group bg-slate-50 border border-indigo-100 rounded-xl p-4 cursor-pointer">
                          <summary className="font-bold text-indigo-900 flex justify-between items-center select-none">
                            <span>Course Syllabus</span>
                            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded group-open:rotate-180 transition-transform">
                              ▼
                            </span>
                          </summary>
                          <div className="mt-3 flex flex-col gap-2 pt-3 border-t border-indigo-100">
                            {selectedCourse.syllabus.map((item, sIdx) => (
                              <div
                                key={sIdx}
                                className="flex flex-col bg-white rounded border border-slate-200 overflow-hidden"
                              >
                                <div
                                  onClick={() =>
                                    setActiveSyllabus(
                                      activeSyllabus === sIdx ? null : sIdx,
                                    )
                                  }
                                  className="p-3 flex justify-between items-center hover:bg-slate-50 cursor-pointer"
                                >
                                  <span className="font-semibold text-sm text-indigo-900">
                                    {item.title}
                                  </span>
                                  <span className="text-xs text-indigo-600 font-medium">
                                    Details
                                  </span>
                                </div>
                                {activeSyllabus === sIdx && (
                                  <div className="p-3 bg-indigo-50/50 border-t border-indigo-100 text-xs text-slate-600">
                                    <p>
                                      <strong>Module Details:</strong>{" "}
                                      {item.desc}
                                    </p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </details>

                        {/* Assessment / Assignments Section */}
                        <div className="bg-slate-50 border border-indigo-100 rounded-xl p-4 flex flex-col gap-3">
                          <h3 className="font-bold text-indigo-900">
                            Assessment & Assignments
                          </h3>
                          <div className="flex flex-col gap-2">
                            {selectedCourse.assignments.map(
                              (assignment, aIdx) => (
                                <div
                                  key={aIdx}
                                  className="flex flex-col bg-white border border-slate-200 rounded-lg overflow-hidden"
                                >
                                  <div
                                    onClick={() =>
                                      setActiveAssignment(
                                        activeAssignment === aIdx ? null : aIdx,
                                      )
                                    }
                                    className="p-3 flex justify-between items-center hover:bg-slate-50 cursor-pointer"
                                  >
                                    <div>
                                      <p className="font-semibold text-sm text-slate-800">
                                        {assignment.title}
                                      </p>
                                      <p className="text-xs text-slate-400 mt-0.5">
                                        Due: {assignment.dueDate}
                                      </p>
                                    </div>
                                    <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 font-semibold px-2.5 py-1 rounded">
                                      Pending
                                    </span>
                                  </div>
                                  {activeAssignment === aIdx && (
                                    <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 flex flex-col gap-2">
                                      <p>
                                        <strong>Instructions:</strong>{" "}
                                        {assignment.details}
                                      </p>
                                      <button
                                        onClick={() =>
                                          alert(
                                            `Submitted assignment: ${assignment.title}`,
                                          )
                                        }
                                        className="self-start py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium transition-colors cursor-pointer"
                                      >
                                        Submit Assignment
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Participants Sidebar with Photo support */}
                      <div className="w-full lg:w-72 bg-slate-50 border border-indigo-100 rounded-xl p-4 flex flex-col gap-3 shrink-0">
                        <h3 className="font-bold text-indigo-900 text-sm uppercase tracking-wider">
                          Enrolled Participants (
                          {selectedCourse.participants.length})
                        </h3>
                        <div className="flex flex-col gap-2">
                          {selectedCourse.participants.map(
                            (participant, pIdx) => (
                              <div
                                key={pIdx}
                                className="bg-white border border-slate-200 p-2.5 rounded-lg flex items-center justify-between shadow-2xs"
                              >
                                <div className="flex items-center gap-2.5">
                                  {participant.avatar ? (
                                    <img
                                      src={participant.avatar}
                                      alt={participant.name}
                                      className="w-7 h-7 rounded-full object-cover border border-indigo-200"
                                    />
                                  ) : (
                                    <div className="w-7 h-7 bg-indigo-100 text-indigo-700 font-bold text-xs rounded-full flex items-center justify-center">
                                      {participant.name.charAt(0)}
                                    </div>
                                  )}
                                  <span className="text-sm font-medium text-slate-700">
                                    {participant.name}
                                  </span>
                                </div>
                                <span className="text-xs text-slate-400">
                                  {participant.role}
                                </span>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  renderTabContent()
                )}
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
    </div>
  );
}
