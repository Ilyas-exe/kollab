import Task from '../models/Task.js';
import Project from '../models/Project.js';
import { createNotification } from '../utils/notificationService.js'; // <-- MODIFICATION

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

    // --- AJOUT DE LA NOTIFICATION ---
    if (assigneeId) {
        const text = `You have been assigned a new task: "${title}"`;
        const link = `/projects/${projectId}`;
        await createNotification(assigneeId, text, link);
    }
    // --- FIN DE L'AJOUT ---

    res.status(201).json(createdTask);
};

// @desc    Get all tasks for a specific project with pagination
// @route   GET /api/projects/:projectId/tasks
const getTasksForProject = async (req, res) => {
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
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

// @desc    Update a task
// @route   PUT /api/tasks/:taskId
const updateTask = async (req, res) => {
    const { title, description, status, assigneeId } = req.body;
    
    try {
        const task = await Task.findById(req.params.taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // --- SECURITY CHECK ---
        const project = await Project.findById(task.projectId);
        if (!project.members.includes(req.user._id)) {
            return res.status(403).json({ message: 'User is not a member of this project' });
        }
        // --- END SECURITY CHECK ---

        const oldAssignee = task.assigneeId;

        task.title = title || task.title;
        task.description = description !== undefined ? description : task.description;
        task.status = status || task.status;
        task.assigneeId = assigneeId !== undefined ? assigneeId : task.assigneeId;

        const updatedTask = await task.save();

        if (updatedTask.assigneeId && !updatedTask.assigneeId.equals(oldAssignee)) {
            const text = `You have been assigned to the task: "${updatedTask.title}"`;
            const link = `/projects/${updatedTask.projectId}`;
            await createNotification(updatedTask.assigneeId, text, link);
        }

        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// --- NEW FUNCTION ---
// @desc    Delete a task
// @route   DELETE /api/tasks/:taskId
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // --- SECURITY CHECK ---
        const project = await Project.findById(task.projectId);
        if (!project.members.includes(req.user._id)) {
            return res.status(403).json({ message: 'User is not a member of this project' });
        }
        // --- END SECURITY CHECK ---

        await task.deleteOne();
        res.json({ message: 'Task removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export { createTask, getTasksForProject, updateTask, deleteTask };