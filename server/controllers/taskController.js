import Task from '../models/Task.js';

// @desc    Create a new task
// @route   POST /api/tasks
const createTask = async (req, res) => {
    const { title, projectId, assigneeId } = req.body;

    if (!title || !projectId) {
        return res.status(400).json({ message: 'Please provide a title and projectId' });
    }

    const task = new Task({
        title,
        projectId,
        assigneeId: assigneeId || null,
    });

    const createdTask = await task.save();
    res.status(201).json(createdTask);
};

// @desc    Get all tasks for a specific project with pagination
// @route   GET /api/projects/:projectId/tasks
const getTasksForProject = async (req, res) => {
    const limit = Number(req.query.limit) || 10; // Default to 10 items per page
    const page = Number(req.query.page) || 1;    // Default to the first page

    const projectId = req.params.projectId;

    try {
        const count = await Task.countDocuments({ projectId: projectId });
        const tasks = await Task.find({ projectId: projectId })
                                .populate('assigneeId', 'name email')
                                .limit(limit)
                                .skip(limit * (page - 1));

        res.json({
            tasks,
            page,
            pages: Math.ceil(count / limit),
            total: count
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
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