import { createBrowserRouter, Navigate, useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Home from "../pages/Home";
import About from "../pages/About";
import Projects from "../pages/Projects";
import Skills from "../pages/Skills";
import Contact from "../pages/Contact";
import ProjectDetail from "../pages/ProjectDetail";

function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-5">
      <h1 className="text-6xl font-bold text-[var(--primary)]">404</h1>
      <p className="text-xl text-[var(--muted)]">Page not found</p>
      <button
        onClick={() => navigate(-1)}
        className="mt-2 px-5 py-2.5 rounded-xl bg-[var(--primary)] text-[var(--bg)] font-semibold hover:brightness-110 transition-all min-h-[44px]"
      >
        Go back
      </button>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: "home", element: <Home /> },
      { path: "about", element: <About /> },
      { path: "projects", element: <Projects /> },
      { path: "project/:repoName", element: <ProjectDetail /> },
      { path: "skills", element: <Skills /> },
      { path: "contact", element: <Contact /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;
