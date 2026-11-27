import { useState } from "react";
import {
  getAssignmentSubmissions,
  saveAssignmentSubmission,
} from "./assignmentSubmissions";

const getCourseStatus = (course) => {
  const startDate = new Date(course["Start-date"]);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + course.durationWeeks * 7);
  const now = new Date();

  if (now < startDate) return "Pending";
  if (now <= endDate) return "Ongoing";
  return "Completed";
};

const statusClass = {
  Ongoing: "bg-blue-100 text-blue-700 border-blue-200",
  Completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Pending: "bg-amber-100 text-amber-700 border-amber-200",
};

export default function CoursesPage({
  courses,
  viewMode = "catalog",
  joinedCourseCodes = [],
  onJoinCourse,
  onBrowseCourses,
  enrollmentError = "",
  userName = "Student",
  userEmail = "",
  availabilityError = "",
}) {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeAssignment, setActiveAssignment] = useState(null);
  const [submissionState, setSubmissionState] = useState(() => {
    try {
      return { submissions: getAssignmentSubmissions(), error: "" };
    } catch (error) {
      return {
        submissions: [],
        error:
          error instanceof Error
            ? error.message
            : "Unable to load assignment submissions.",
      };
    }
  });
  const isAssignmentCompleted = (course, assignment) =>
    assignment.isCompleted ||
    submissionState.submissions.some(
      (submission) =>
        submission.studentId === (userEmail || userName).trim().toLowerCase() &&
        submission.courseCode === course["Course-Code"] &&
        submission.assignmentTitle === assignment.title,
    );

  if (selectedCourse) {
    const status = getCourseStatus(selectedCourse);

    return (
      <div className="flex flex-col gap-6">
        <button
          onClick={() => setSelectedCourse(null)}
          className="self-start rounded-lg bg-indigo-50 px-3.5 py-2 text-sm font-semibold text-indigo-600 transition-colors hover:bg-indigo-100 hover:text-indigo-800"
        >
          ← Back to Courses
        </button>

        <div className="flex flex-col items-start gap-6 lg:flex-row">
          <div className="flex w-full flex-1 flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className="rounded bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                  {selectedCourse["Course-Code"]}
                </span>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusClass[status]}`}
                >
                  {status}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-indigo-900">
                {selectedCourse.Title}
              </h2>
              <p className="text-base leading-relaxed text-slate-600">
                {selectedCourse.Description}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 rounded-xl border border-indigo-100 bg-slate-50 p-4 sm:grid-cols-2">
              <CourseMetadata label="Instructor" value={selectedCourse.Instructor} />
              <CourseMetadata label="Duration" value={selectedCourse.Duration} />
              <CourseMetadata
                label="Start Time & Date"
                value={`${selectedCourse["Start-date"]} (${selectedCourse.Time})`}
              />
              <CourseMetadata
                label="Materials Included"
                value={selectedCourse.Materials}
              />
            </div>

            <details className="group cursor-pointer rounded-xl border border-indigo-100 bg-slate-50 p-4">
              <summary className="flex select-none items-center justify-between font-bold text-indigo-900">
                <span>Course Videos</span>
                <span className="rounded bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700 transition-transform group-open:rotate-180">
                  ▼
                </span>
              </summary>
              <div className="mt-3 flex flex-col gap-2 border-t border-indigo-100 pt-3">
                {selectedCourse.videos.map((video) => (
                  <details
                    key={video.title}
                    className="overflow-hidden rounded border border-slate-200 bg-white"
                  >
                    <summary className="flex cursor-pointer items-center justify-between p-3 hover:bg-slate-50">
                      <span className="text-sm font-medium text-slate-800">
                        {video.title}
                      </span>
                      <span className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600">
                        {video.duration}
                      </span>
                    </summary>
                    <div className="flex items-center justify-between border-t border-indigo-100 bg-indigo-50/50 p-3 text-xs text-slate-600">
                      <p>
                        <strong>Lesson Preview Overview:</strong> {video.content}
                      </p>
                      <button
                        onClick={() => alert(`Playing video: ${video.title}`)}
                        className="ml-4 shrink-0 rounded bg-indigo-600 px-3 py-1.5 font-medium text-white transition-colors hover:bg-indigo-700"
                      >
                        Play
                      </button>
                    </div>
                  </details>
                ))}
              </div>
            </details>

            <details className="group cursor-pointer rounded-xl border border-indigo-100 bg-slate-50 p-4">
              <summary className="flex select-none items-center justify-between font-bold text-indigo-900">
                <span>Course Syllabus</span>
                <span className="rounded bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700 transition-transform group-open:rotate-180">
                  ▼
                </span>
              </summary>
              <div className="mt-3 flex flex-col gap-2 border-t border-indigo-100 pt-3">
                {selectedCourse.syllabus.map((item) => (
                  <details
                    key={item.title}
                    className="overflow-hidden rounded border border-slate-200 bg-white"
                  >
                    <summary className="flex cursor-pointer items-center justify-between p-3 hover:bg-slate-50">
                      <span className="text-sm font-semibold text-indigo-900">
                        {item.title}
                      </span>
                      <span className="text-xs font-medium text-indigo-600">
                        Details
                      </span>
                    </summary>
                    <p className="border-t border-indigo-100 bg-indigo-50/50 p-3 text-xs text-slate-600">
                      <strong>Module Details:</strong> {item.desc}
                    </p>
                  </details>
                ))}
              </div>
            </details>

            <section className="flex flex-col gap-3 rounded-xl border border-indigo-100 bg-slate-50 p-4">
              <h3 className="font-bold text-indigo-900">
                Assessment & Assignments
              </h3>
              <div className="flex flex-col gap-2">
                {selectedCourse.assignments.map((assignment, index) => (
                  <details
                    key={assignment.title}
                    className="overflow-hidden rounded-lg border border-slate-200 bg-white"
                    onToggle={(event) =>
                      setActiveAssignment(
                        event.currentTarget.open ? index : null,
                      )
                    }
                  >
                    <summary className="flex cursor-pointer items-center justify-between p-3 hover:bg-slate-50">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {assignment.title}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-400">
                          Due: {assignment.dueDate}
                        </p>
                      </div>
                      <span
                        className={`rounded border px-2.5 py-1 text-xs font-semibold ${isAssignmentCompleted(selectedCourse, assignment) ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}
                      >
                        {isAssignmentCompleted(selectedCourse, assignment)
                          ? "Completed"
                          : "Pending"}
                      </span>
                    </summary>
                    {activeAssignment === index && (
                      <div className="flex flex-col gap-2 border-t border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                        <p>
                          <strong>Instructions:</strong> {assignment.details}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            if (
                              isAssignmentCompleted(selectedCourse, assignment)
                            ) {
                              alert(
                                `Viewing submitted assignment: ${assignment.title}`,
                              );
                            } else {
                              try {
                                setSubmissionState({
                                  submissions: saveAssignmentSubmission({
                                    studentId: userEmail || userName,
                                    studentName: userName,
                                    courseCode: selectedCourse["Course-Code"],
                                    assignmentTitle: assignment.title,
                                  }),
                                  error: "",
                                });
                              } catch (error) {
                                setSubmissionState((current) => ({
                                  ...current,
                                  error:
                                    error instanceof Error
                                      ? error.message
                                      : "Unable to submit this assignment.",
                                }));
                              }
                            }
                          }}
                          className={`self-start rounded px-3 py-1.5 font-medium text-white transition-colors ${isAssignmentCompleted(selectedCourse, assignment) ? "bg-emerald-600 hover:bg-emerald-700" : "bg-indigo-600 hover:bg-indigo-700"}`}
                        >
                          {isAssignmentCompleted(selectedCourse, assignment)
                            ? "View"
                            : "Submit Assignment"}
                        </button>
                      </div>
                    )}
                  </details>
                ))}
              </div>
            </section>
            {submissionState.error && (
              <p role="alert" className="text-sm text-rose-600">
                {submissionState.error}
              </p>
            )}
          </div>

          <aside className="flex w-full shrink-0 flex-col gap-3 rounded-xl border border-indigo-100 bg-slate-50 p-4 lg:w-72">
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-900">
              Enrolled Participants ({selectedCourse.participants.length})
            </h3>
            <div className="flex flex-col gap-2">
              {selectedCourse.participants.map((participant) => (
                <div
                  key={participant.name}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-2.5 shadow-2xs"
                >
                  <div className="flex items-center gap-2.5">
                    {participant.avatar ? (
                      <img
                        src={participant.avatar}
                        alt={participant.name}
                        className="h-7 w-7 rounded-full border border-indigo-200 object-cover"
                      />
                    ) : (
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
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
              ))}
            </div>
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-slate-800">
        {viewMode === "joined" ? "My Courses" : "All Courses"}
      </h2>
      {submissionState.error && (
        <p role="alert" className="text-sm text-rose-600">
          {submissionState.error}
        </p>
      )}
      {enrollmentError && (
        <p role="alert" className="text-sm text-rose-600">
          {enrollmentError}
        </p>
      )}
      {availabilityError && (
        <p role="alert" className="text-sm text-rose-600">
          {availabilityError}
        </p>
      )}
      {viewMode === "joined" && courses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
          <h3 className="font-semibold text-slate-900">
            You haven’t joined any courses yet
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Browse the course catalog and join a course to see it here.
          </p>
          <button
            type="button"
            onClick={onBrowseCourses}
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Browse All Courses
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => {
          const status = getCourseStatus(course);
          const isJoined = joinedCourseCodes.includes(course["Course-Code"]);
          const completedCount = course.assignments.filter((assignment) =>
            isAssignmentCompleted(course, assignment),
          ).length;
          return (
            <article
              key={course["Course-Code"]}
              className={`flex flex-col justify-between gap-4 rounded-lg border p-4 shadow-sm transition-shadow ${
                course.enabled === false
                  ? "border-slate-200 bg-slate-100 opacity-75"
                  : "border-indigo-200 bg-slate-50 hover:shadow-md"
              }`}
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
                  className={`w-fit rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusClass[status]}`}
                >
                  {status}
                </span>
                {course.enabled === false && (
                  <span className="w-fit rounded-full border border-slate-300 bg-slate-200 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                    Disabled
                  </span>
                )}
                <div className="mt-1 flex flex-col gap-1 text-sm text-slate-600">
                  <p>Instructor: {course.Instructor}</p>
                  <p>Duration: {course.Duration}</p>
                  <p>Time: {course.Time}</p>
                  <p>Start Date: {course["Start-date"]}</p>
                  <p>
                    Assignments completed: {completedCount} /{" "}
                    {course.assignments.length}
                  </p>
                </div>
              </div>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  disabled={course.enabled === false}
                  onClick={() => {
                    setSelectedCourse(course);
                    setActiveAssignment(null);
                  }}
                  className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {course.enabled === false ? "Course disabled" : "View Details"}
                </button>
                {viewMode === "catalog" && (
                  <button
                    type="button"
                    disabled={course.enabled === false || isJoined}
                    onClick={() => onJoinCourse?.(course["Course-Code"])}
                    className="flex-1 rounded-lg border border-indigo-200 px-3 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-500"
                  >
                    {isJoined ? "Joined" : "Join Course"}
                  </button>
                )}
              </div>
            </article>
          );
        })}
        </div>
      )}
    </div>
  );
}

function CourseMetadata({ label, value }) {
  return (
    <div>
      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
        {label}
      </span>
      <p className="mt-0.5 font-medium text-slate-700">{value}</p>
    </div>
  );
}
