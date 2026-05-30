import { Link } from "react-router-dom";

function ProjectCard({ project }) {
  return (
    <Link
      to={`/project/${project._id}`}
      state={{ projectName: project.name }}
      className="group block rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">{project.name}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            {project.description || "No description yet."}
          </p>
        </div>
        <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700 transition duration-300 group-hover:bg-indigo-200">
          View
        </span>
      </div>
    </Link>
  );
}

export default ProjectCard;
