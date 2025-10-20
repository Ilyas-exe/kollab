import Project from '../models/Project.js';
import Workspace from '../models/Workspace.js';

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req, res) => {
  const { name, workspaceId } = req.body;

  if (!name || !workspaceId) {
    return res.status(400).json({ message: 'Please provide a name and a workspaceId' });
  }

  // Verification: Is the user making the request a member of the workspace?
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace || !workspace.members.includes(req.user._id)) {
    return res.status(403).json({ message: 'Not authorized to access this workspace' });
  }

  const project = new Project({
    name,
    workspaceId,
    members: [req.user._id], // The creator is the first member
  });

  const createdProject = await project.save();
  res.status(201).json(createdProject);
};

// @desc    Get projects for a workspace
// @route   GET /api/workspaces/:workspaceId/projects
// @access  Private
export const getProjectsForWorkspace = async (req, res) => {
    try {
        const workspaceId = req.params.workspaceId;
        const userId = req.user._id;

        // --- LA CORRECTION DE SÉCURITÉ EST ICI ---
        // 1. On cherche le workspace
        const workspace = await Workspace.findById(workspaceId);

        // 2. On vérifie si le workspace existe ET si l'utilisateur est bien membre
        if (!workspace || !workspace.members.includes(userId)) {
            return res.status(403).json({ message: 'Not authorized to access this workspace' }); // 403 Forbidden est plus précis
        }
        // --- FIN DE LA CORRECTION ---

        // Le reste de la logique ne change pas
        const limit = Number(req.query.limit) || 10;
        const page = Number(req.query.page) || 1;

        const count = await Project.countDocuments({ workspaceId: workspaceId });
        const projects = await Project.find({ workspaceId: workspaceId })
                                      .populate('members', 'name')
                                      .limit(limit)
                                      .skip(limit * (page - 1));
        
        res.json({
            projects: projects, // On renvoie l'objet complet
            page,
            pages: Math.ceil(count / limit),
            total: count
        });
    } catch (error) {
        console.error("Error in getProjectsForWorkspace:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get a single project by ID with its members
// @route   GET /api/projects/:id
// @access  Private
export const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
                                     .populate('members', 'name email'); // On enrichit avec les détails des membres

        if (project) {
            // Vérification de sécurité : l'utilisateur fait-il partie des membres ?
            if (!project.members.some(member => member._id.equals(req.user._id))) {
                return res.status(403).json({ message: 'Not authorized to access this project' });
            }
            res.json(project);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getMyAssignedProjects = async (req, res) => {
  try {
    // Trouve tous les projets où l'utilisateur est membre
    const projects = await Project.find({ members: { $in: [req.user.id] } })
      .populate('workspaceId', 'name'); // Ajoute le nom du workspace
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
export const updateProject = async (req, res) => {
    const { name } = req.body;
    try {
        const project = await Project.findById(req.params.id).populate('workspaceId');
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        // --- SECURITY CHECK (Only workspace owner can update) ---
        if (project.workspaceId.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'User is not the owner of this workspace' });
        }
        // --- END SECURITY CHECK ---
        project.name = name || project.name;
        const updatedProject = await project.save();
        res.json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
export const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('workspaceId');
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        // --- SECURITY CHECK (Only workspace owner can delete) ---
        if (project.workspaceId.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'User is not the owner of this workspace' });
        }
        // --- END SECURITY CHECK ---

        // Also delete all tasks within this project
        await Task.deleteMany({ projectId: project._id });
        await project.deleteOne();
        res.json({ message: 'Project and all its tasks removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
