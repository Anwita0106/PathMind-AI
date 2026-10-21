export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200/60 bg-slate-50 py-6 text-center text-xs text-slate-500 dark:border-slate-800/60 dark:bg-slate-950/20 dark:text-slate-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} PathMind AI. Developed as an interactive educational search algorithm prototype.</p>
        <p className="mt-1.5 text-slate-400 dark:text-slate-600">
          Covering State Space Search, Uninformed Search (BFS, DFS), and Informed Search (UCS, A*) concepts.
        </p>
      </div>
    </footer>
  );
}
