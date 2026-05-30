import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import TaskCard from "../components/TaskCard";
import LoadingSpinner from "../components/LoadingSpinner";

function ProjectPage() {
  const { projectId } = useParams();
  const location = useLocation();
  const [projectName, setProjectName] = useState(location.state?.projectName || "Project");
  const [tasks, setTasks] = useState([]);
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Medium",
  });
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!location.state?.projectName) {
      fetchProjectName();
    }
    fetchTasks();
  }, [projectId]);

  const fetchProjectName = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:5000/api/projects/${projectId}`, {
        headers: {
          Authorization: token,
        },
      });
      setProjectName(response.data.name);
    } catch (error) {
      console.log(error);
      setFeedback("Unable to load project name.");
    }
  };

  const fetchTasks = async () => {
    setLoading(true);
    setFeedback("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:5000/api/tasks/project/${projectId}`, {
        headers: {
          Authorization: token,
        },
      });
      setTasks(response.data);
    } catch (error) {
      console.log(error);
      setFeedback("Unable to load tasks. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setTaskData({
      ...taskData,
      [e.target.name]: e.target.value,
    });
  };

  const createTask = async (e) => {
    e.preventDefault();
    setCreating(true);
    setFeedback("");

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/tasks/create",
        {
          ...taskData,
          project: projectId,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setTaskData({ title: "", description: "", priority: "Medium" });
      setFeedback("Task created successfully.");
      fetchTasks();
    } catch (error) {
      console.log(error);
      setFeedback("Could not create task. Try again.");
    } finally {
      setCreating(false);
    }
  };

  const updateStatus = async (taskId, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/tasks/update-status/${taskId}`,
        { status },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      fetchTasks();
    } catch (error) {
      console.log(error);
      setFeedback("Unable to update task status. Please try again.");
    }
  };

  return (
    <div className="space-y-10">
      <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">Project</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">{projectName}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Add tasks, assign priority, and update status from a polished project workspace.
            </p>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Back to dashboard
          </Link>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[0.7fr_0.3fr]">
        <section className="space-y-5">
          <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft">
            <div className="mb-6">
              <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">New task</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-900">Create a task</h2>
            </div>
            <form className="space-y-5" onSubmit={createTask}>
              <div>
                <label className="block text-sm font-medium text-slate-700">Task title</label>
                <input
                  name="title"
                  value={taskData.title}
                  onChange={handleChange}
                  required
                  className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  placeholder="Enter task title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Description</label>
                <textarea
                  name="description"
                  value={taskData.description}
                  onChange={handleChange}
                  rows={4}
                  className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  placeholder="Describe the task"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Priority</label>
                <select
                  name="priority"
                  value={taskData.priority}
                  onChange={handleChange}
                  className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={creating}
                className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {creating ? "Adding task..." : "Create task"}
              </button>
            </form>
            {feedback && <p className="mt-5 text-sm text-slate-600">{feedback}</p>}
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Task list</h2>
                <p className="mt-2 text-sm text-slate-500">Update task status and keep your project moving.</p>
              </div>
            </div>
            {loading ? (
              <LoadingSpinner />
            ) : tasks.length === 0 ? (
              <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center text-slate-500">
                No tasks yet. Use the form to add a new task.
              </div>
            ) : (
              <div className="mt-8 space-y-4">
                {tasks.map((task) => (
                  <TaskCard key={task._id} task={task} onStatusChange={updateStatus} />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default ProjectPage;
