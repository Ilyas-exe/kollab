// Fichier: /server/controllers/invitationController.js
import Invitation from "../models/Invitation.js";
import Project from "../models/Project.js";
import User from "../models/User.js";
import Workspace from "../models/Workspace.js";
import sendEmail from '../utils/sendEmail.js';
import crypto from "crypto";
import { createNotification } from '../utils/notificationService.js'; // <-- MODIFICATION

const createInvitation = async (req, res) => {
  const { email, projectId } = req.body;
  const inviterId = req.user.id;
  try {
    const project = await Project.findById(projectId);
    const inviter = await User.findById(inviterId);
    if (!project || !inviter) {
      return res.status(404).json({ message: 'Project or inviter not found' });
    }
    const token = crypto.randomBytes(32).toString('hex');
    const newInvitation = new Invitation({ email, projectId, inviterId, token });
    await newInvitation.save();
    const invitationLink = `http://localhost:5173/accept-invitation?token=${token}`;
    const message = `
      <h1>Invitation to join a project on Kollab</h1>
      <p>Hello,</p>
      <p><b>${inviter.name}</b> has invited you to join the project "<b>${project.name}</b>" on the Kollab collaboration platform.</p>
      <p>Click the link below to accept the invitation and create your account:</p>
      <a href="${invitationLink}" style="padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px;">Accept Invitation</a>
      <p>If you cannot click the link, copy and paste this URL into your browser: ${invitationLink}</p>
    `;
    await sendEmail({
      email: email,
      subject: `${inviter.name} has invited you to collaborate on Kollab`,
      message,
    });
    res.status(201).json({
      success: true,
      message: `Invitation sent successfully to ${email}.`,
    });
  } catch (error) {
    console.error("Error sending invitation:", error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const verifyInvitation = async (req, res) => {
    try {
        const token = req.params.token;
        const invitation = await Invitation.findOne({ token, status: 'Pending' }).populate('projectId', 'name');
        if (!invitation) {
            return res.status(404).json({ success: false, message: 'Invitation not found or has expired.' });
        }
        res.status(200).json({
            success: true,
            email: invitation.email,
            project: invitation.projectId
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const acceptInvitation = async (req, res) => {
    const { token, name, password } = req.body;
    try {
        const invitation = await Invitation.findOne({ token, status: 'Pending' });
        if (!invitation) {
            return res.status(404).json({ success: false, message: 'Invitation not found or has expired.' });
        }
        const project = await Project.findById(invitation.projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: 'The project associated with this invitation no longer exists.' });
        }

        // Check if user already exists
        let existingUser = await User.findOne({ email: invitation.email });
        let userId;
        let userName;

        if (existingUser) {
            // User already exists - just add them to the project
            userId = existingUser._id;
            userName = existingUser.name;
            
            // Add to project members
            project.members.addToSet(userId);
            await project.save();
            
            // Add to workspace members
            await Workspace.findByIdAndUpdate(project.workspaceId, {
                $addToSet: { members: userId }
            });
            
            invitation.status = 'Accepted';
            await invitation.save();

            // Send notification
            const text = `"${userName}" has accepted your invitation to join the project "${project.name}".`;
            const link = `/projects/${project._id}`;
            await createNotification(invitation.inviterId, text, link);

            return res.status(200).json({ 
                success: true, 
                message: 'You have been added to the project. Please log in with your existing account.',
                userExists: true 
            });
        } else {
            // User doesn't exist - create new account
            const newUser = new User({
                name,
                email: invitation.email,
                password,
                role: 'Freelancer'
            });
            await newUser.save();
            
            userId = newUser._id;
            userName = newUser.name;
            
            // Add to project members
            project.members.addToSet(userId);
            await project.save();
            
            // Add to workspace members
            await Workspace.findByIdAndUpdate(project.workspaceId, {
                $addToSet: { members: userId }
            });
            
            invitation.status = 'Accepted';
            await invitation.save();

            // Send notification
            const text = `"${userName}" has accepted your invitation to join the project "${project.name}".`;
            const link = `/projects/${project._id}`;
            await createNotification(invitation.inviterId, text, link);

            return res.status(201).json({ 
                success: true, 
                message: 'Account created and invitation accepted.',
                userExists: false 
            });
        }

    } catch (error) {
        console.error("Error accepting invitation:", error);
        res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
};

export {
  createInvitation,
  verifyInvitation,
  acceptInvitation
};