const express = require("express");

const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", authMiddleware, async (req, res) => {
  try {

    const {
      title,
      description,
      dueDate,
      priority,
      project,
      assignedTo
    } = req.body;

    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      project,
      assignedTo,
      createdBy: req.user.id,
    });

    res.status(201).json(task);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


router.put("/update-status/:taskId", authMiddleware, async (req, res) => {

  try {

    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    task.status = req.body.status;

    await task.save();

    res.json(task);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
});


router.get("/project/:projectId", authMiddleware, async (req, res) => {

  try {

    const tasks = await Task.find({
      project: req.params.projectId,
    });

    res.json(tasks);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
});
module.exports = router;