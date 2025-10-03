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
    const projects = await Project.find({ workspaceId: req.params.workspaceId });
    res.json(projects);
};

