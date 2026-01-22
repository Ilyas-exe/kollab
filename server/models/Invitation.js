// Fichier: /server/models/Invitation.js
import mongoose from 'mongoose';

const InvitationSchema = new mongoose.Schema({
  email: { type: String, required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  inviterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true, unique: true },
  status: { type: String, enum: ['Pending', 'Accepted'], default: 'Pending' }
}, { timestamps: true });

const Invitation = mongoose.model('Invitation', InvitationSchema);

export default Invitation;