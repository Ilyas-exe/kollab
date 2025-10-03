// Fichier: /server/controllers/invitationController.js
import Invitation from "../models/Invitation.js";
import Project from "../models/Project.js"; // On en aura besoin
import User from "../models/User.js"; // On en aura besoin
import Workspace from "../models/Workspace.js";
import sendEmail from '../utils/sendEmail.js'; // <-- AJOUT de notre utilitaire
import crypto from "crypto";

// @desc    Create a new invitation
// @route   POST /api/invitations
// @access  Private


const createInvitation = async (req, res) => {
  const { email, projectId } = req.body;
  const inviterId = req.user.id;

  try {
    // On récupère les informations pour personnaliser l'email
    const project = await Project.findById(projectId);
    const inviter = await User.findById(inviterId);

    if (!project || !inviter) {
      return res.status(404).json({ message: 'Project or inviter not found' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const newInvitation = new Invitation({ email, projectId, inviterId, token });
    await newInvitation.save();

    const invitationLink = `http://localhost:5173/accept-invitation?token=${token}`;

    // Préparer le contenu de l'email personnalisé
    const message = `
      <h1>Invitation à rejoindre un projet sur Kollab</h1>
      <p>Bonjour,</p>
      <p><b>${inviter.name}</b> vous a invité à rejoindre le projet "<b>${project.name}</b>" sur la plateforme de collaboration Kollab.</p>
      <p>Cliquez sur le lien ci-dessous pour accepter l'invitation et créer votre compte :</p>
      <a href="${invitationLink}" style="padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px;">Accepter l'invitation</a>
      <p>Si vous ne pouvez pas cliquer sur le lien, copiez et collez cette URL dans votre navigateur : ${invitationLink}</p>
    `;

    // Envoyer l'email
    await sendEmail({
      email: email, // L'email du freelance
      subject: `${inviter.name} vous a invité à collaborer sur Kollab`,
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

// ... ici on ajoutera verifyInvitation et acceptInvitation plus tard ...
// AJOUT: La fonction pour vérifier un token (pour la page d'acceptation)
const verifyInvitation = async (req, res) => {
    try {
        const token = req.params.token;
        const invitation = await Invitation.findOne({ token, status: 'Pending' }).populate('projectId', 'name');

        if (!invitation) {
            return res.status(404).json({ success: false, message: 'Invitation not found or has expired.' });
        }

        // On renvoie les détails de l'invitation pour les afficher sur la page
        res.status(200).json({
            success: true,
            email: invitation.email,
            project: invitation.projectId
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// AJOUT: La fonction pour accepter une invitation (ce que tu testes)
// Fichier: /server/controllers/invitationController.js

// ... (imports et autres fonctions) ...

const acceptInvitation = async (req, res) => {
    const { token, name, password } = req.body;
    try {
        // --- ÉTAPE 1: Trouver l'invitation ---
        const invitation = await Invitation.findOne({ token, status: 'Pending' });
        if (!invitation) {
            return res.status(404).json({ success: false, message: 'Invitation not found or has expired.' });
        }

        // --- ÉTAPE 2: Trouver le projet associé ---
        // VÉRIFICATION AJOUTÉE : On s'assure que le projet existe toujours
        const project = await Project.findById(invitation.projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: 'The project associated with this invitation no longer exists.' });
        }

        // --- ÉTAPE 3: Créer le nouvel utilisateur ---
        const newUser = new User({
            name,
            email: invitation.email,
            password,
            role: 'Freelancer'
        });
        await newUser.save();

        // --- ÉTAPE 4: Ajouter l'utilisateur au projet ET au workspace ---
        // On utilise $addToSet qui est plus sûr car il évite les doublons
        project.members.addToSet(newUser._id);
        await project.save();

        await Workspace.findByIdAndUpdate(project.workspaceId, {
            $addToSet: { members: newUser._id }
        });
        
        // --- ÉTAPE 5: Mettre à jour l'invitation ---
        invitation.status = 'Accepted';
        await invitation.save();

        res.status(201).json({ success: true, message: 'Account created and invitation accepted.' });

    } catch (error) {
        // En cas d'erreur, on envoie un message clair
        console.error("Error accepting invitation:", error); // Très important pour le débogage
        res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
};


export {
  createInvitation,
  verifyInvitation,
  acceptInvitation
};