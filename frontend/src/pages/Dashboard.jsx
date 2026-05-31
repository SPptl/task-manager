import { useEffect, useState } from "react";
import axios from "axios";
import ProjectCard from "../components/ProjectCard";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
  });
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [creating, setCreating] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE}/api/projects/my-projects`, {
        headers: {
          Authorization: token,
        },
      });
      setProjects(response.data);
    } catch (error) {
      console.log(error);
      setFeedback("Unable to load projects. Please refresh or login again.");
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleChange = (e) => {
    setProjectData({
      ...projectData,
      [e.target.name]: e.target.value,
    });
  };

  const createProject = async (e) => {
    e.preventDefault();
    setCreating(true);
    setFeedback("");

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_BASE}/api/projects/create`, projectData, {
        headers: {
          Authorization: token,
        },
      });
      setProjectData({ name: "", description: "" });
      setFeedback("Project created successfully.");
      fetchProjects();
    } catch (error) {
      console.log(error);
      setFeedback("Failed to create project. Try again.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-10">
      <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">Dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Your active projects</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Create new projects and manage your work with clean cards and modern interaction.
            </p>
          </div>
          <div className="rounded-3xl bg-indigo-50 p-5 text-sm text-indigo-700 shadow-sm">
            {projects.length} project{projects.length === 1 ? "" : "s"} found
          </div>
        </div>
      </section>

      <div className="grid gap-8 xl:grid-cols-[0.72fr_0.28fr]">
        <section className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Project library</h2>
              <p className="mt-2 text-sm text-slate-500">Browse your project cards and open a project to manage tasks.</p>
            </div>
          </div>

          {loadingProjects ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-soft">
              Loading your projects...
            </div>
          ) : projects.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center text-slate-500 shadow-sm">
              You have no projects yet. Create one with the form on the right.
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          )}
        </section>

        <aside className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">New project</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">Create a project</h2>
            <p className="mt-2 text-sm text-slate-500">Add a new workspace for your tasks and team.</p>
          </div>

          <form className="space-y-5" onSubmit={createProject}>
            <div>
              <label className="block text-sm font-medium text-slate-700">Project name</label>
              <input
                name="name"
                required
                value={projectData.name}
                onChange={handleChange}
                className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                placeholder="e.g. Marketing sprint"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Description</label>
              <textarea
                name="description"
                required
                value={projectData.description}
                onChange={handleChange}
                rows={4}
                className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                placeholder="Write a short summary for the project"
              />
            </div>

            <button
              type="submit"
              disabled={creating}
              className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {creating ? "Creating project..." : "Create project"}
            </button>
          </form>

          {feedback && <p className="mt-5 text-sm text-slate-600">{feedback}</p>}
        </aside>
      </div>
    </div>
  );
}

export default Dashboard;
