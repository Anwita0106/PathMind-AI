import { Sun, Moon, Compass } from "lucide-react";

type HeaderProps = {
  currentPath: string;
  onNavigate: (path: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
};

export function Header({
  currentPath,
  onNavigate,
  darkMode,
  onToggleDarkMode,
}: HeaderProps) {
  const links = [
    { path: "#/", label: "Home" },
    { path: "#/visualizer", label: "Visualizer" },
    { path: "#/about", label: "About Algorithms" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/85">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div
          onClick={() => onNavigate("#/")}
          className="flex cursor-pointer items-center space-x-2.5 transition-transform hover:scale-102"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 shadow-md shadow-purple-500/20 text-white">
            <Compass className="h-5.5 w-5.5 animate-spin-slow" />
          </div>
          <span className="bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 bg-clip-text text-xl font-bold tracking-tight text-transparent">
            PathMind AI
          </span>
        </div>

        {/* Navigation */}
        <nav className="hidden sm:flex space-x-1.5">
          {links.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <button
                key={link.path}
                onClick={() => onNavigate(link.path)}
                className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-150"
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          {/* Mobile menu link indicator (simplified responsive navigation) */}
          <div className="flex sm:hidden space-x-1">
            {links.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => onNavigate(link.path)}
                  className={`rounded-md p-1.5 text-xs font-semibold ${
                    isActive
                      ? "text-purple-600 dark:text-purple-400"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {link.label.split(" ")[0]}
                </button>
              );
            })}
          </div>

          <button
            onClick={onToggleDarkMode}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-150"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}
