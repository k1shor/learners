import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import courses from "../data/courses.json";
import { getTaskProgress, readTaskProgressStore } from "../utils/taskProgress";
import categoryTheme from "../utils/categoryTheme";

const formatCompletionDate = (date) =>
  date ? new Date(date).toLocaleDateString() : "";

const downloadCertificate = async (course, completedAt, learnerName) => {
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  pdf.setFillColor(250, 249, 246);
  pdf.rect(0, 0, pageWidth, pageHeight, "F");
  pdf.setDrawColor(82, 127, 105);
  pdf.setLineWidth(1.2);
  pdf.rect(8, 8, pageWidth - 16, pageHeight - 16);
  pdf.setDrawColor(181, 201, 158);
  pdf.setLineWidth(0.35);
  pdf.rect(12, 12, pageWidth - 24, pageHeight - 24);

  pdf.setTextColor(82, 127, 105);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.text("E-LEARNERSHUB", pageWidth / 2, 31, { align: "center" });

  pdf.setTextColor(32, 56, 50);
  pdf.setFontSize(26);
  pdf.text("Certificate of Completion", pageWidth / 2, 61, {
    align: "center",
  });

  pdf.setTextColor(100, 117, 108);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(12);
  pdf.text("This certificate is presented to", pageWidth / 2, 82, {
    align: "center",
  });

  pdf.setTextColor(53, 92, 76);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(23);
  pdf.text(learnerName, pageWidth / 2, 101, { align: "center" });
  pdf.setDrawColor(181, 201, 158);
  pdf.line(pageWidth / 2 - 48, 106, pageWidth / 2 + 48, 106);

  pdf.setTextColor(100, 117, 108);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(12);
  pdf.text("for completing the course", pageWidth / 2, 124, {
    align: "center",
  });

  pdf.setTextColor(32, 56, 50);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text(course.title, pageWidth / 2, 141, {
    align: "center",
    maxWidth: pageWidth - 50,
  });

  pdf.setTextColor(100, 117, 108);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text(
    `${course.course_code}  |  Instructor: ${course.instructor}`,
    pageWidth / 2,
    153,
    { align: "center" },
  );

  const completionDate = formatCompletionDate(completedAt);
  if (completionDate) {
    pdf.text(`Completed on ${completionDate}`, pageWidth / 2, 166, {
      align: "center",
    });
  }

  pdf.setTextColor(82, 127, 105);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.text("E-LearnersHub", pageWidth / 2, 184, { align: "center" });

  const fileName = `${course.course_code}-${course.title}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  pdf.save(`${fileName}-certificate.pdf`);
};

const CertificatesPage = () => {
  const { user } = useOutletContext();
  const learnerName = user?.name ?? "Learner";
  const [selectedCourse, setSelectedCourse] = useState(null);
  const progressStore = readTaskProgressStore();
  const earnedCertificates = courses.filter(
    (course) => getTaskProgress(course, progressStore).isCompleted,
  );

  return (
    <section
      aria-label="Certificates page"
      className="mx-auto w-full max-w-6xl"
    >
      <header className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#63824d]">
            Your achievements
          </p>
          <h2 className="mt-1 text-3xl font-bold tracking-tight text-[#173c35] sm:text-4xl">
            Certificates
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64756c]">
            Complete a course to unlock its certificate. Earned certificates can
            be viewed and downloaded as PDFs.
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#d9d4c7] bg-[#fffefa] px-3.5 py-2 text-sm font-semibold text-[#53685e] shadow-sm">
          {earnedCertificates.length} of {courses.length} earned
        </span>
      </header>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {courses.map((course) => {
          const taskProgress = getTaskProgress(course, progressStore);
          const isEarned = taskProgress.isCompleted;
          const theme = categoryTheme[course.category];

          return (
            <article
              key={`${course.course_code}-${course.title}`}
              className={`app-card flex flex-col overflow-hidden rounded-[22px] border shadow-sm transition ${
                isEarned
                  ? "border-[#b4c99c] hover:-translate-y-0.5 hover:shadow-md"
                  : (theme?.border ?? "border-[#e5e0d5]")
              }`}
            >
              <div
                className={`relative grid aspect-[1.6/1] place-items-center overflow-hidden bg-linear-to-br p-4 ${
                  isEarned
                    ? (theme?.certificatePanel ??
                      "from-[#edf3e3] via-[#fffefa] to-[#e0ece4]")
                    : (theme?.panel ?? "from-[#f5f3ec] to-[#fffefa]")
                }`}
              >
                <div
                  className={`absolute inset-3 rounded-lg border ${
                    isEarned
                      ? "border-[#a9c18f]"
                      : (theme?.border ?? "border-slate-300")
                  }`}
                />
                <div
                  className={`relative w-full max-w-xs rounded-md border bg-[#fffefa]/95 px-4 py-5 text-center shadow-sm ${
                    isEarned
                      ? "border-[#d8e5cb]"
                      : "border-[#e5e0d5] opacity-75"
                  }`}
                >
                  <span
                    className={`text-[9px] font-bold uppercase tracking-[0.2em] ${theme?.accent ?? "text-[#63824d]"}`}
                  >
                    E-LearnersHub
                  </span>
                  <p className="mt-3 text-sm font-bold text-[#203832]">
                    Certificate of Completion
                  </p>
                  <div className="mx-auto my-2 h-px w-12 bg-[#b5c99e]" />
                  <p className="truncate text-xs font-semibold text-[#355c4c]">
                    {course.title}
                  </p>
                  <p className="mt-2 text-[9px] text-[#78877b]">
                    {learnerName}
                  </p>
                </div>
                <span
                  className={`absolute right-5 top-5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                    isEarned
                      ? "bg-[#e4efda] text-[#355c4c]"
                      : "bg-[#fffefa]/90 text-[#64756c] shadow-sm"
                  }`}
                >
                  {isEarned ? "Earned" : "Locked"}
                </span>
                {!isEarned && (
                  <span
                    aria-hidden="true"
                    className="absolute grid size-10 place-items-center rounded-full bg-[#29483f]/85 text-white shadow-lg"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="size-5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <rect x="5" y="10" width="14" height="11" rx="2" />
                      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                    </svg>
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col p-5">
                <p
                  className={`text-xs font-semibold uppercase tracking-wider ${theme?.accent ?? "text-[#78877b]"}`}
                >
                  {course.course_code}
                </p>
                <h3 className="mt-1 text-lg font-bold leading-snug text-[#203832]">
                  {course.title}
                </h3>
                <p className="mt-1 text-sm text-[#64756c]">
                  Instructor: {course.instructor}
                </p>
                {isEarned ? (
                  taskProgress.completedAt && (
                    <p className="mt-2 text-xs font-medium text-[#527f69]">
                      Completed {formatCompletionDate(taskProgress.completedAt)}
                    </p>
                  )
                ) : (
                  <p className="mt-3 text-xs text-[#78877b]">
                    Complete all course tasks to unlock this certificate.
                  </p>
                )}
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedCourse(course)}
                    disabled={!isEarned}
                    className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#527f69] ${
                      isEarned
                        ? "border-[#d9d4c7] text-[#53685e] hover:border-[#b8c9a1] hover:bg-[#f3f6e8] hover:text-[#355c4c]"
                        : "cursor-not-allowed border-[#e5e0d5] bg-[#f5f3ec] text-[#9aa398]"
                    }`}
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="size-4"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                      <circle cx="12" cy="12" r="2.5" />
                    </svg>
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      downloadCertificate(
                        course,
                        taskProgress.completedAt,
                        learnerName,
                      )
                    }
                    disabled={!isEarned}
                    className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#527f69] focus-visible:ring-offset-2 ${
                      isEarned
                        ? "bg-[#173c35] text-white shadow-sm hover:bg-[#28584a]"
                        : "cursor-not-allowed bg-[#e9e6dc] text-[#9aa398]"
                    }`}
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="size-4"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v3h16v-3" />
                    </svg>
                    PDF
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {selectedCourse && (
        <div
          className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-[#173c35]/65 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedCourse(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="certificate-dialog-title"
            className="my-auto w-full max-w-4xl overflow-hidden rounded-2xl border border-[#ded9cd] bg-[#fffefa] shadow-2xl"
          >
            <div className="flex items-center justify-between gap-4 border-b border-[#e5e0d5] px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#63824d]">
                  Earned certificate
                </p>
                <h3
                  id="certificate-dialog-title"
                  className="mt-1 text-lg font-bold text-[#203832]"
                >
                  {selectedCourse.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCourse(null)}
                aria-label="Close certificate preview"
                className="grid size-10 shrink-0 place-items-center rounded-lg text-2xl leading-none text-[#78877b] transition hover:bg-[#f5f3ec] hover:text-[#203832] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#527f69]"
              >
                ×
              </button>
            </div>

            <div className="bg-[#f1eee5] p-4 sm:p-7">
              <div className="relative mx-auto grid aspect-[1.414/1] w-full max-w-3xl place-items-center overflow-hidden bg-[#faf9f6] p-5 text-center shadow-lg sm:p-10">
                <div className="absolute inset-2 border-2 border-[#527f69] sm:inset-3" />
                <div className="absolute inset-4 border border-[#b5c99e] sm:inset-5" />
                <div className="relative max-w-2xl">
                  <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#63824d] sm:text-xs">
                    E-LearnersHub
                  </p>
                  <p className="mt-3 text-base font-semibold text-[#203832] sm:mt-5 sm:text-2xl">
                    Certificate of Completion
                  </p>
                  <p className="mt-2 text-[9px] text-[#78877b] sm:mt-4 sm:text-sm">
                    This certificate is presented to
                  </p>
                  <p className="mt-1 text-sm font-bold text-[#355c4c] sm:mt-2 sm:text-2xl">
                    {learnerName}
                  </p>
                  <div className="mx-auto mt-2 h-px w-24 bg-[#b5c99e] sm:mt-3" />
                  <p className="mt-2 text-[9px] text-[#78877b] sm:mt-4 sm:text-sm">
                    for completing the course
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs font-bold text-[#203832] sm:mt-2 sm:text-xl">
                    {selectedCourse.title}
                  </p>
                  <p className="mt-1 text-[8px] text-[#78877b] sm:mt-2 sm:text-xs">
                    {selectedCourse.course_code} · Instructor:{" "}
                    {selectedCourse.instructor}
                  </p>
                  {getTaskProgress(selectedCourse, progressStore)
                    .completedAt && (
                    <p className="mt-2 text-[8px] text-[#78877b] sm:mt-4 sm:text-xs">
                      Completed on{" "}
                      {formatCompletionDate(
                        getTaskProgress(selectedCourse, progressStore)
                          .completedAt,
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse justify-between gap-3 border-t border-[#e5e0d5] px-5 py-4 sm:flex-row sm:items-center sm:px-6">
              <p className="text-xs leading-5 text-[#78877b]">
                Awarded for completing this course.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedCourse(null)}
                  className="min-h-10 rounded-lg px-4 py-2 text-sm font-semibold text-[#53685e] transition hover:bg-[#f5f3ec]"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() =>
                    downloadCertificate(
                      selectedCourse,
                      getTaskProgress(selectedCourse, progressStore)
                        .completedAt,
                      learnerName,
                    )
                  }
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#173c35] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#28584a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#527f69] focus-visible:ring-offset-2"
                >
                  Download PDF
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </section>
  );
};

export default CertificatesPage;
