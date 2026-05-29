import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ProjectPage() {

  const { projectId } = useParams();

  const [tasks, setTasks] = useState([]);

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Medium",
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://localhost:5000/api/tasks/project/${projectId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setTasks(response.data);

    } catch (error) {
      console.log(error);
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

      alert("Task created!");

      setTaskData({
        title: "",
        description: "",
        priority: "Medium",
      });

      fetchTasks();

    } catch (error) {
      console.log(error);
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
  }
};
  
  return (
    <div style={{ padding: "20px" }}>

      <h2>Project Tasks</h2>

      <form onSubmit={createTask}>

        <input
          type="text"
          name="title"
          placeholder="Task Title"
          value={taskData.title}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="text"
          name="description"
          placeholder="Description"
          value={taskData.description}
          onChange={handleChange}
        />

        <br /><br />

        <select
          name="priority"
          value={taskData.priority}
          onChange={handleChange}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <br /><br />

        <button type="submit">
          Create Task
        </button>

      </form>

      <hr />

      {
        tasks.map((task) => (

          <div
            key={task._id}
            style={{
              border: "1px solid black",
              padding: "10px",
              marginTop: "10px",
            }}
          >

            <h4>{task.title}</h4>

            <p>{task.description}</p>

            <select
            value={task.status}
            onChange={(e) =>
                updateStatus(task._id, e.target.value)
            }
            >

            <option>To Do</option>
            <option>In Progress</option>
            <option>Done</option>

            </select>
            <p>Priority: {task.priority}</p>

          </div>
        ))
      }

    </div>
  );
}

export default ProjectPage;