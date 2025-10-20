// Fichier: /server/models/Invoice.js
import mongoose from 'mongoose';

const lineItemSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
}, {_id: false}); // _id: false est une bonne pratique pour les sous-documents

const InvoiceSchema = new mongoose.Schema({
    invoiceNumber: {
        type: String,
        required: true,
        unique: true
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    freelancerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // On va stocker les informations du projet/client directement
    // pour que la facture reste la même même si le projet est supprimé.
    projectName: {
        type: String,
        required: true
    },
    clientName: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Draft', 'Sent', 'Paid'],
        default: 'Draft'
    },
    lineItems: [lineItemSchema],
    totalAmount: {
        type: Number,
        required: true
    },
    issueDate: {
        type: Date,
        default: Date.now
    },
    stripePaymentIntentId: {
        type: String
    }
}, { timestamps: true });


const Invoice = mongoose.model('Invoice', InvoiceSchema);

export default Invoice;