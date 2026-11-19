function downloadFile(file) {
  const url = URL.createObjectURL(
    new Blob([file.content], { type: "text/plain;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = file.name;
  link.click();
  URL.revokeObjectURL(url);
}

export default function FilesPage({ files }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-slate-800">Your Files</h2>
      {files.length > 0 ? (
        <ul className="divide-y divide-slate-100 rounded-xl border border-indigo-100 bg-white">
          {files.map((file) => (
            <li
              key={file.id}
              className="flex flex-wrap items-center justify-between gap-3 p-4"
            >
              <div>
                <p className="font-semibold text-slate-800">{file.name}</p>
                <p className="mt-1 text-sm text-slate-500">{file.course}</p>
              </div>
              <button
                type="button"
                onClick={() => downloadFile(file)}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
              >
                Download
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
          No files yet. Download a certificate to find it here.
        </p>
      )}
    </div>
  );
}
