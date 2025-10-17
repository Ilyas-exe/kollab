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
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const workspaceId = req.params.workspaceId;

    try {
        const count = await Project.countDocuments({ workspaceId: workspaceId });
        const projects = await Project.find({ workspaceId: workspaceId })
                                      .populate('members', 'name')
                                      .limit(limit)
                                      .skip(limit * (page - 1));
        
        res.json({
            projects,
            page,
            pages: Math.ceil(count / limit),
            total: count
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get a single project by ID with its members
// @route   GET /api/projects/:id
// @access  Private
export const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
                                     .populate('members', 'name email'); // Populate members' details
        if (project) {
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
