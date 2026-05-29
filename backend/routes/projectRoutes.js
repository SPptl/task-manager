const express = require("express");

const Project = require("../models/Project");
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

module.exports = router;