import Workspace from '../models/Workspace.js';

export const createWorkspace = async (req, res) => {
  const { name } = req.body;
  const workspace = new Workspace({ name, owner: req.user._id });
  const createdWorkspace = await workspace.save();
  res.status(201).json(createdWorkspace);
};

export const getWorkspaces = async (req, res) => {
  const workspaces = await Workspace.find({ owner: req.user._id });
  res.json(workspaces);
};