import { useState, useEffect } from "react";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { HomePage } from "./app/HomePage";
import { VisualizerPage } from "./app/VisualizerPage";
import { AboutPage } from "./app/AboutPage";
import { NotFoundPage } from "./app/NotFoundPage";

/**
 * Root Application Component.
 * Implements a lightweight client-side Hash Router and controls dark/light mode state.
 */
function App() {
  const [currentPath, setCurrentPath] = useState(() => window.location.hash || "#/");
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Track hash routing changes
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash || "#/");
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  // Sync dark mode style class to root HTML element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleNavigate = (path: string) => {
    window.location.hash = path;
  };

  // Custom Router Page Mapping
  const renderPage = () => {
    switch (currentPath) {
      case "#/":
      case "":
        return <HomePage />;
      case "#/visualizer":
        return <VisualizerPage />;
      case "#/about":
        return <AboutPage />;
      default:
        return <NotFoundPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      <Header
        currentPath={currentPath}
        onNavigate={handleNavigate}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />
      <main className="flex-1 flex flex-col">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}

export default App;
