import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import TaskCard from "../components/TaskCard";
import LoadingSpinner from "../components/LoadingSpinner";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function ProjectPage() {
  const { projectId } = useParams();
  const location = useLocation();
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [projectName, setProjectName] = useState(location.state?.projectName || "Project");
  const [projectDetails, setProjectDetails] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
    assignedTo: "",
  });
  const [memberEmail, setMemberEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    fetchProjectDetails();
    fetchTasks();
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE}/api/projects/${projectId}`, {
        headers: { Authorization: token },
      });
      setProjectName(response.data.name || "Project");
      setProjectDetails(response.data);
    } catch (error) {
      console.log(error);
      setFeedback("Unable to load project details.");
    }
  };

  const fetchTasks = async () => {
    setLoading(true);
    setFeedback("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE}/api/tasks/project/${projectId}`, {
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
        `${API_BASE}/api/tasks/create`,
        {
          ...taskData,
          project: projectId,
          dueDate: taskData.dueDate || undefined,
          assignedTo: taskData.assignedTo || undefined,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setTaskData({ title: "", description: "", priority: "Medium", dueDate: "", assignedTo: "" });
      setFeedback("Task created successfully.");
      fetchTasks();
    } catch (error) {
      console.log(error);
      setFeedback("Could not create task. Try again.");
    } finally {
      setCreating(false);
    }
  };

  const addMember = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_BASE}/api/projects/add-member/${projectId}`, { email: memberEmail }, { headers: { Authorization: token } });
      setMemberEmail("");
      fetchProjectDetails();
      setFeedback("Member added successfully.");
    } catch (error) {
      console.log(error);
      setFeedback("Unable to add member. Check the email and try again.");
    }
  };

  const removeMember = async (memberId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_BASE}/api/projects/remove-member/${projectId}`, { memberId }, { headers: { Authorization: token } });
      fetchProjectDetails();
      setFeedback("Member removed successfully.");
    } catch (error) {
      console.log(error);
      setFeedback("Unable to remove member.");
    }
  };

  const updateStatus = async (taskId, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE}/api/tasks/update-status/${taskId}`,
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
              Add tasks, assign due dates and members, and update status from a polished project workspace.
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
                <label className="block text-sm font-medium text-slate-700">Due date</label>
                <input
                  name="dueDate"
                  type="date"
                  value={taskData.dueDate}
                  onChange={handleChange}
                  className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Assign to</label>
                <select
                  name="assignedTo"
                  value={taskData.assignedTo}
                  onChange={handleChange}
                  className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="">Unassigned</option>
                  {(projectDetails?.members || []).map((member) => (
                    <option key={member._id} value={member._id}>{member.name} ({member.email})</option>
                  ))}
                </select>
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

        <aside className="space-y-5">
          <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft">
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">Project overview</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">Admin & members</h2>
            <p className="mt-2 text-sm text-slate-500">Add teammates to the project and manage who can work on it.</p>
            <div className="mt-5 space-y-3 text-sm text-slate-700">
              <p><span className="font-semibold">Admin:</span> {projectDetails?.admin?.name || "—"}</p>
              <p><span className="font-semibold">Members:</span> {(projectDetails?.members || []).length}</p>
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft">
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">Manage members</p>
            <h3 className="mt-3 text-xl font-semibold text-slate-900">Add or remove collaborators</h3>
            <form className="mt-5 space-y-4" onSubmit={addMember}>
              <input
                type="email"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                placeholder="member@example.com"
              />
              <button type="submit" className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">Add member</button>
            </form>
            <div className="mt-5 space-y-3">
              {(projectDetails?.members || []).map((member) => (
                <div key={member._id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                  <div>
                    <p className="font-semibold text-slate-900">{member.name}</p>
                    <p className="text-xs text-slate-500">{member.email}</p>
                  </div>
                  {projectDetails?.admin?._id === currentUser.id && member._id !== projectDetails?.admin?._id && (
                    <button type="button" onClick={() => removeMember(member._id)} className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">Remove</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default ProjectPage;
