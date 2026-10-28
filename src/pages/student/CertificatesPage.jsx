import { useState } from "react";

const getCourseStatus = (course) => {
  const startDate = new Date(course["Start-date"]);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + course.durationWeeks * 7);
  return new Date() > endDate ? "Completed" : "Ongoing";
};

export default function CertificatesPage({ courses, userName }) {
  const [selectedCourse, setSelectedCourse] = useState(null);

  if (selectedCourse) {
    return (
      <div className="flex flex-col gap-6">
        <button
          onClick={() => setSelectedCourse(null)}
          className="self-start rounded-lg bg-indigo-50 px-3.5 py-2 text-sm font-semibold text-indigo-600 transition-colors hover:bg-indigo-100 hover:text-indigo-800"
        >
          ← Back to Certificates
        </button>
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 rounded-2xl border-4 border-indigo-200 bg-white p-8 text-center shadow-md">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
              E-learners Hub
            </span>
            <h3 className="text-2xl font-extrabold text-slate-800">
              Certificate of Completion
            </h3>
          </div>
          <p className="text-sm text-slate-500">This is proudly presented to</p>
          <p className="border-b-2 border-indigo-100 px-6 pb-2 text-3xl font-bold text-indigo-900">
            {userName}
          </p>
          <p className="max-w-md text-sm leading-relaxed text-slate-600">
            for successfully completing the comprehensive curriculum and
            assessments for{" "}
            <strong className="text-slate-800">{selectedCourse.Title}</strong>{" "}
            ({selectedCourse["Course-Code"]}) instructed by{" "}
            {selectedCourse.Instructor}.
          </p>
          <div className="flex w-full items-center justify-between border-t border-indigo-100 pt-8 text-xs text-slate-400">
            <div>
              <p className="font-bold text-slate-700">Issued Date</p>
              <p>October 2026</p>
            </div>
            <div>
              <p className="font-bold text-slate-700">Credential ID</p>
              <p>ELH-{selectedCourse["Course-Code"]}-2026</p>
            </div>
          </div>
        </div>
        <button
          onClick={() =>
            alert(
              `Downloading official certificate for ${selectedCourse.Title}`,
            )
          }
          className="self-center rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
        >
          Download Certificate
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-slate-800">Your Certificates</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => {
          const isCompleted = getCourseStatus(course) === "Completed";
          return (
            <article
              key={course["Course-Code"]}
              className="flex flex-col justify-between gap-4 rounded-lg border border-indigo-200 bg-slate-50 p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-bold leading-snug text-indigo-900">
                    {course.Title}
                  </h3>
                  <span className="shrink-0 rounded bg-indigo-100 px-2 py-1 text-xs font-semibold text-indigo-700">
                    {course["Course-Code"]}
                  </span>
                </div>
                <span
                  className={`w-fit rounded-full border px-2.5 py-0.5 text-xs font-semibold ${isCompleted ? "border-emerald-200 bg-emerald-100 text-emerald-700" : "border-slate-200 bg-slate-100 text-slate-600"}`}
                >
                  {isCompleted ? "Available" : "Locked (Course Ongoing)"}
                </span>
                <div className="mt-1 flex flex-col gap-1 text-sm text-slate-600">
                  <p>Instructor: {course.Instructor}</p>
                  <p>Duration: {course.Duration}</p>
                  <p>Start Date: {course["Start-date"]}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (isCompleted) {
                    setSelectedCourse(course);
                  } else {
                    alert(
                      "Certificate is available once the course status is Completed.",
                    );
                  }
                }}
                className={`mt-2 w-full rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors ${isCompleted ? "bg-indigo-600 hover:bg-indigo-700" : "bg-slate-400 hover:bg-slate-500"}`}
              >
                {isCompleted ? "View Certificate" : "Certificate Locked"}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
