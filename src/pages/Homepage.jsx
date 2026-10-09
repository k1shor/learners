import courses from "../data/courses.json";
const Courses = () => {
  return (
    <section aria-label="Courses page" className="max-w-6xl">
      <div className="mb-5">
        <h2 className="text-2xl font-semibold text-slate-900">Courses</h2>
        <p className="mt-1 text-sm text-slate-600">
          Course schedule and instructor information.
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-300 text-slate-700">
              <th className="px-5 py-3 font-semibold">Course</th>
              <th className="px-5 py-3 font-semibold">Instructor</th>
              <th className="px-5 py-3 font-semibold">Start date</th>
              <th className="px-5 py-3 font-semibold">Time</th>
              <th className="px-5 py-3 font-semibold">Course code</th>
              <th className="px-5 py-3 font-semibold">Duration</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr
                key={`${course.course_code}-${course.title}`}
                className="border-b border-slate-200 last:border-b-0 hover:bg-slate-50"
              >
                <td className="px-5 py-4">
                  <p className="font-medium text-slate-900">{course.title}</p>
                </td>
                <td className="px-5 py-4 text-slate-700">
                  {course.instructor}
                </td>
                <td className="px-5 py-4 text-slate-700">
                  {course.start_date}
                </td>
                <td className="px-5 py-4 text-slate-700">{course.time}</td>
                <td className="px-5 py-4 font-mono text-slate-600">
                  {course.course_code}
                </td>
                <td className="px-5 py-4 text-slate-700">{course.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Courses;
