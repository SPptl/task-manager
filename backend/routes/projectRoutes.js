const express = require("express");

const Project = require("../models/Project");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const User = require("../models/User");

router.put("/add-member/:projectId", authMiddleware, async (req, res) => {
  try {

    const { email } = req.body;

    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // only admin can add members
    if (project.admin.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Only admin can add members",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // avoid duplicates
    if (project.members.includes(user._id)) {
      return res.status(400).json({
        message: "User already member",
      });
    }

    project.members.push(user._id);

    await project.save();

    res.json({
      message: "Member added successfully",
      project,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/my-projects", authMiddleware, async (req, res) => {
  try {

    const projects = await Project.find({
      members: req.user.id,
    });

    res.json(projects);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/dashboard-stats", authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find({ members: req.user.id });
    const projectIds = projects.map((project) => project._id);

    const tasks = await Task.find({ project: { $in: projectIds } })
      .populate("assignedTo", "name email")
      .populate("project", "name");

    const byStatus = { "To Do": 0, "In Progress": 0, Done: 0 };
    const byUser = {};

    tasks.forEach((task) => {
      byStatus[task.status] = (byStatus[task.status] || 0) + 1;

      const userName = task.assignedTo?.name || "Unassigned";
      byUser[userName] = (byUser[userName] || 0) + 1;
    });

    const overdueTasks = tasks.filter((task) => {
      return task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "Done";
    }).length;

    res.json({
      totalTasks: tasks.length,
      byStatus,
      byUser,
      overdueTasks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { name, description } = req.body;

    const project = await Project.create({
      name,
      description,
      admin: req.user.id,
      members: [req.user.id],
    });

    res.status(201).json(project);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/:projectId", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId)
      .populate("admin", "name email role")
      .populate("members", "name email role");

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.put("/remove-member/:projectId", authMiddleware, async (req, res) => {
  try {
    const { memberId } = req.body;

    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only admin can remove members" });
    }

    if (memberId === project.admin.toString()) {
      return res.status(400).json({ message: "Admin cannot be removed" });
    }

    project.members = project.members.filter((id) => id.toString() !== memberId);
    await project.save();

    res.json({ message: "Member removed successfully", project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;