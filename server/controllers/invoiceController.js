// Fichier: /server/controllers/invoiceController.js
import Invoice from '../models/Invoice.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
import Workspace from '../models/Workspace.js';
import PDFDocument from 'pdfkit';
import { createNotification } from '../utils/notificationService.js'; // <-- MODIFICATION

// @desc    Create a new invoice
// @route   POST /api/invoices
// @access  Private (Freelancer)
export const createInvoice = async (req, res) => {
    const { projectId, lineItems } = req.body;
    const freelancerId = req.user.id;

    if (req.user.role !== 'Freelancer') {
        return res.status(403).json({ message: 'Only freelancers can create invoices.' });
    }

    try {
        const project = await Project.findById(projectId).populate('workspaceId');
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        let client = await User.findById(project.owner);
        if(!client){
             const workspace = await Workspace.findById(project.workspaceId);
             client = await User.findById(workspace.owner);
        }

        const totalAmount = lineItems.reduce((sum, item) => sum + item.amount, 0);
        const invoiceNumber = `INV-${Date.now()}`;

        const invoice = new Invoice({
            invoiceNumber,
            projectId,
            freelancerId,
            projectName: project.name,
            clientName: client ? client.name : 'N/A',
            lineItems,
            totalAmount
        });

        const createdInvoice = await invoice.save();

        // --- AJOUT DE LA NOTIFICATION ---
        if (client) {
             const text = `A new invoice (${invoice.invoiceNumber}) has been created for your project "${project.name}".`;
             const link = `/projects/${projectId}/invoices`; // Lien hypothétique vers la future page de factures
             await createNotification(client._id, text, link);
        }
        // --- FIN DE L'AJOUT ---

        res.status(201).json(createdInvoice);
    } catch (error) {
        console.error("Error creating invoice:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all invoices for a project
// @route   GET /api/projects/:projectId/invoices
// @access  Private
export const getInvoicesForProject = async (req, res) => {
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const projectId = req.params.projectId;

    try {
        const count = await Invoice.countDocuments({ projectId: projectId });
        const invoices = await Invoice.find({ projectId: projectId })
                                       .limit(limit)
                                       .skip(limit * (page - 1));

        res.json({
            invoices,
            page,
            pages: Math.ceil(count / limit),
            total: count
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Download an invoice as a PDF
// @route   GET /api/invoices/:invoiceId/download
// @access  Private
export const downloadInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.invoiceId).populate('freelancerId', 'name email');
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        const doc = new PDFDocument({ size: 'A4', margin: 50 });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${invoice.invoiceNumber || 'invoice'}.pdf`);
        doc.pipe(res);
        
        const generateHr = (y) => doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
        doc.fontSize(20).text('INVOICE', { align: 'center' });
        doc.moveDown(2);
        const infoTop = doc.y;
        doc.fontSize(10)
            .text(`Invoice Number: ${invoice.invoiceNumber || 'N/A'}`, 50, infoTop)
            .text(`Issue Date: ${invoice.issueDate ? new Date(invoice.issueDate).toLocaleDateString() : 'N/A'}`, { align: 'right' })
            .text(`Project: ${invoice.projectName || 'N/A'}`, 50, infoTop + 15)
            .moveDown(2);
        const customerInfoTop = doc.y;
        doc.text(`Billed To:`, 50, customerInfoTop)
            .font('Helvetica-Bold').text(invoice.clientName || 'Unknown Client', 50, customerInfoTop + 15)
            .font('Helvetica').text('From:', 300, customerInfoTop)
            .font('Helvetica-Bold').text(invoice.freelancerId?.name || 'Unknown Freelancer', 300, customerInfoTop + 15)
            .font('Helvetica').text(invoice.freelancerId?.email || '', 300, customerInfoTop + 30)
            .moveDown(3);
        const invoiceTableTop = doc.y;
        doc.font('Helvetica-Bold');
        doc.text('Description', 50, invoiceTableTop)
           .text('Amount', 450, invoiceTableTop, { width: 90, align: 'right' });
        generateHr(invoiceTableTop + 20);
        doc.font('Helvetica');
        doc.moveDown();
        let position = invoiceTableTop + 30;
        if (invoice.lineItems && Array.isArray(invoice.lineItems)) {
            invoice.lineItems.forEach(item => {
                const description = item.description || 'No description';
                const amount = typeof item.amount === 'number' ? item.amount.toFixed(2) : '0.00';
                
                doc.text(description, 50, position, { width: 380 })
                   .text(`$${amount}`, 450, position, { width: 90, align: 'right' });
                
                const textHeight = doc.heightOfString(description, { width: 380 });
                position += textHeight + 10;
            });
        }
        generateHr(position);
        doc.moveDown();
        const totalAmount = typeof invoice.totalAmount === 'number' ? invoice.totalAmount.toFixed(2) : '0.00';
        doc.font('Helvetica-Bold').fontSize(12)
           .text('Total:', 300, position + 10)
           .text(`$${totalAmount}`, 450, position + 10, { width: 90, align: 'right' });
        
        doc.end();

    } catch (error) {
        console.error("Error downloading invoice:", error);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Server Error while fetching invoice data' });
        }
    }
};