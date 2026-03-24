export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6">

        <h1 className="text-3xl font-bold text-blue-900 mb-4">
          Student Help Center
        </h1>

        <p className="mb-6 text-slate-700">
          Upload an assignment, syllabus, or ask a question about Canvas or
          online learning.
        </p>

        {/* File Upload */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Upload File (PDF or Word)
          </label>
          <input
            type="file"
            className="block w-full border rounded p-2"
          />
        </div>

        {/* Question Box */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Ask a question..."
            className="flex-1 border rounded p-2"
          />
          <button className="bg-blue-900 text-white px-4 rounded hover:bg-blue-800">
            Ask
          </button>
        </div>

        {/* Answer Area */}
        <div className="bg-slate-50 border rounded p-4 mb-6">
          <p className="text-slate-600">
            Answer will appear here.
          </p>
        </div>

        {/* Video Area */}
        <div className="bg-slate-50 border rounded p-4">
          <p className="font-semibold mb-2">Helpful Video</p>

          <iframe
            width="100%"
            height="315"
            src="https://www.youtube.com/embed/5I1wq0WzW9k"
            title="Canvas Help Video"
            allowFullScreen
          ></iframe>
        </div>

      </div>
    </main>
  );
}