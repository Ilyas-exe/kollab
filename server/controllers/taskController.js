import Task from '../models/Task.js';

// @desc    Create a new task
// @route   POST /api/tasks
const createTask = async (req, res) => {
    const { title, projectId } = req.body;

    if (!title || !projectId) {
        return res.status(400).json({ message: 'Please provide a title and projectId' });
    }

    const task = new Task({
        title,
        projectId,
        // You can add more fields like description and assigneeId here
    });

    const createdTask = await task.save();
    res.status(201).json(createdTask);
};

// @desc    Get all tasks for a specific project
// @route   GET /api/projects/:projectId/tasks
const getTasksForProject = async (req, res) => {
    const tasks = await Task.find({ projectId: req.params.projectId });
    res.json(tasks);
};

// @desc    Update a task (e.g., change its status)
// @route   PUT /api/tasks/:taskId
const updateTask = async (req, res) => {
    const { title, description, status, assigneeId } = req.body;
    const task = await Task.findById(req.params.taskId);

    if (task) {
        task.title = title || task.title;
        task.description = description || task.description;
        task.status = status || task.status;
        task.assigneeId = assigneeId || task.assigneeId;

        const updatedTask = await task.save();
        res.json(updatedTask);
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
};

export { createTask, getTasksForProject, updateTask };