import RequirementForm from '@/components/RequirementForm';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight">
              <span className="text-indigo-600">Go</span>
              <span className="text-slate-800">Pratle</span>
            </h1>
            <span className="hidden sm:inline-block text-xs font-medium text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
              Post a Requirement
            </span>
          </div>
          <div className="text-xs text-slate-400 font-medium">
            Event Services Platform
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Page Introduction */}
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
            Post an Event Requirement
          </h2>
          <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto">
            Tell us about your event and what you need. Complete the form in four
            simple steps and we&apos;ll connect you with the right professionals.
          </p>
        </div>

        <RequirementForm />
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 text-center">
          <p className="text-xs text-slate-400">
            &copy; 2027 GoPratle. Built as a technical assignment demonstration.
          </p>
        </div>
      </footer>
    </div>
  );
}
