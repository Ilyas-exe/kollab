import mongoose from'mongoose';

const projectSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Workspace', // This links to Zakaria's model
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // A project has a list of members (users)
  }],
}, {
  timestamps: true,
});

const Project = mongoose.model('Project', projectSchema);


export default Project;