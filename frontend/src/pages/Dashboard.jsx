import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";


function Dashboard() {

  const [projects, setProjects] = useState([]);

  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/projects/my-projects",
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setProjects(response.data);

    } catch (error) {
      console.log(error);
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

    try {

      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/projects/create",
        projectData,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      alert("Project created!");

      setProjectData({
        name: "",
        description: "",
      });

      fetchProjects();

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>

      <h2>Dashboard</h2>

      <form onSubmit={createProject}>

        <input
          type="text"
          name="name"
          placeholder="Project Name"
          value={projectData.name}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="text"
          name="description"
          placeholder="Description"
          value={projectData.description}
          onChange={handleChange}
        />

        <br /><br />

        <button type="submit">
          Create Project
        </button>

      </form>

      <hr />

      <h3>My Projects</h3>

      {
        projects.map((project) => (

          <div
            key={project._id}
            style={{
              border: "1px solid black",
              marginTop: "10px",
              padding: "10px",
            }}
          >

            <Link to={`/project/${project._id}`}>
            <h4>{project.name}</h4>
            </Link>

            <p>{project.description}</p>

          </div>
        ))
      }

    </div>
  );
}

export default Dashboard;