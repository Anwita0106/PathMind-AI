import { ArrowLeft, Compass } from "lucide-react";

/**
 * Fallback NotFoundPage component.
 * Directs users back to the Home page.
 */
export function NotFoundPage() {
  const navigateToHome = () => {
    window.location.hash = "#/";
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 py-16 text-center text-slate-800 dark:text-slate-100">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 mb-6 shadow-sm">
        <Compass className="h-8 w-8 animate-pulse" />
      </div>
      <h1 className="text-3xl font-extrabold mb-2 tracking-tight">Page Not Found</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-sm">
        The page you are looking for does not exist or has been moved.
      </p>
      <button
        onClick={navigateToHome}
        className="flex items-center space-x-2 rounded-xl bg-purple-650 hover:bg-purple-700 text-white px-5 py-2.5 font-bold transition-all shadow-md shadow-purple-500/10 cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Home</span>
      </button>
    </div>
  );
}
