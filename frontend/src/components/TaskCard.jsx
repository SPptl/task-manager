const priorityStyles = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-orange-100 text-orange-800",
  Low: "bg-emerald-100 text-emerald-700",
};

function TaskCard({ task, onStatusChange }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{task.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">{task.description || "No description provided."}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityStyles[task.priority] || priorityStyles.Medium}`}>
              {task.priority}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {task.status}
            </span>
          </div>
        </div>
        <div className="min-w-[180px] shrink-0">
          <label className="mb-2 block text-sm font-medium text-slate-600">Task Status</label>
          <select
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            value={task.status}
            onChange={(e) => onStatusChange(task._id, e.target.value)}
          >
            <option>To Do</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>
        </div>
      </div>
    </article>
  );
}

export default TaskCard;
