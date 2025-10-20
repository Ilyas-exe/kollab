import Task from '../models/Task.js';
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

// @desc    Update a task (e.g., change its status)
// @route   PUT /api/tasks/:taskId
const updateTask = async (req, res) => {
    const { title, description, status, assigneeId } = req.body;
    const task = await Task.findById(req.params.taskId);

    if (task) {
        const oldAssignee = task.assigneeId; // Sauvegarde de l'ancien assigné

        task.title = title || task.title;
        task.description = description || task.description;
        task.status = status || task.status;
        task.assigneeId = assigneeId || task.assigneeId;

        const updatedTask = await task.save();

        // --- AJOUT DE LA NOTIFICATION ---
        // Notifier seulement si l'assigné change et n'est pas nul
        if (updatedTask.assigneeId && !updatedTask.assigneeId.equals(oldAssignee)) {
            const text = `You have been assigned to the task: "${updatedTask.title}"`;
            const link = `/projects/${updatedTask.projectId}`;
            await createNotification(updatedTask.assigneeId, text, link);
        }
        // --- FIN DE L'AJOUT ---

        res.json(updatedTask);
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
};

export { createTask, getTasksForProject, updateTask };