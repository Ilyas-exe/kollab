import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import CreateInvoiceModal from './CreateInvoiceModal';
import PaymentModal from './PaymentModal';

const InvoiceList = ({ projectId, projectName }) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [viewingInvoice, setViewingInvoice] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { apiClient, user } = useAuth();

  const isFreelancer = user?.role === 'Freelancer';

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/projects/${projectId}/invoices`);
      setInvoices(response.data.invoices || []);
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
    } finally {
      setLoading(false);
    }
  }, [apiClient, projectId]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handleInvoiceCreated = (newInvoice) => {
    setInvoices([newInvoice, ...invoices]);
  };

  const handleInvoiceUpdated = (updatedInvoice) => {
    setInvoices(invoices.map(inv => 
      inv._id === updatedInvoice._id ? updatedInvoice : inv
    ));
    setEditingInvoice(null);
  };

  const handlePaymentSuccess = (updatedInvoice) => {
    setInvoices(invoices.map(inv => 
      inv._id === updatedInvoice._id ? updatedInvoice : inv
    ));
    setSelectedInvoice(null);
  };

  const handleSendInvoice = async (invoiceId) => {
    try {
      const response = await apiClient.put(`/invoices/${invoiceId}`, {
        status: 'Sent'
      });
      
      // Update the invoice in the list
      setInvoices(invoices.map(inv => 
        inv._id === invoiceId ? response.data : inv
      ));
      
      // Update viewing invoice if it's open
      if (viewingInvoice && viewingInvoice._id === invoiceId) {
        setViewingInvoice(response.data);
      }
    } catch (error) {
      console.error('Failed to send invoice:', error);
      alert('Failed to send invoice. Please try again.');
    }
  };

  const handleDeleteInvoice = async (invoiceId, invoiceNumber) => {
    if (!window.confirm(`Are you sure you want to delete invoice ${invoiceNumber}? This action cannot be undone.`)) {
      return;
    }

    try {
      await apiClient.delete(`/invoices/${invoiceId}`);
      
      // Remove from list
      setInvoices(invoices.filter(inv => inv._id !== invoiceId));
      
      // Close viewing modal if open
      if (viewingInvoice && viewingInvoice._id === invoiceId) {
        setViewingInvoice(null);
      }

      // Show success message
      alert('Invoice deleted successfully!');
    } catch (error) {
      console.error('Failed to delete invoice:', error);
      alert(error.response?.data?.message || 'Failed to delete invoice. Please try again.');
    }
  };

  const handleDownloadInvoice = async (invoiceId, invoiceNumber) => {
    try {
      const response = await apiClient.get(`/invoices/${invoiceId}/download`, {
        responseType: 'blob'
      });

      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Failed to download invoice:', error);
      alert('Failed to download invoice');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      Draft: 'bg-gray-100 text-gray-700',
      Sent: 'bg-blue-100 text-blue-700',
      Paid: 'bg-green-100 text-green-700'
    };
    return styles[status] || styles.Draft;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-text-secondary text-sm">Loading invoices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-success bg-opacity-10 flex items-center justify-center">
            <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-text-primary">Invoices</h3>
            <p className="text-sm text-text-secondary">{invoices.length} total</p>
          </div>
        </div>

        {isFreelancer && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-success text-white rounded-lg font-semibold hover:bg-opacity-90 transition-all shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Create Invoice</span>
          </button>
        )}
      </div>

      {/* Invoice List */}
      {invoices.length === 0 ? (
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-text-primary mb-2">No invoices yet</h4>
          <p className="text-text-secondary mb-4">
            {isFreelancer ? 'Create your first invoice for this project' : 'No invoices have been created for this project'}
          </p>
          {isFreelancer && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-success text-white rounded-lg font-medium hover:bg-opacity-90 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Create Invoice</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {invoices.map((invoice) => (
            <div
              key={invoice._id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-3">
                    <h4 className="font-bold text-text-primary text-lg">{invoice.invoiceNumber}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center text-text-secondary">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="font-medium mr-1">Client:</span> {invoice.clientName}
                    </div>
                    <div className="flex items-center text-text-secondary">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium mr-1">Date:</span>
                      {new Date(invoice.issueDate || invoice.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Line Items Preview */}
                  <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                    {invoice.lineItems?.slice(0, 2).map((item, idx) => (
                      <div key={idx} className="text-sm text-text-secondary flex justify-between items-center">
                        <span className="truncate pr-4">{item.description}</span>
                        <span className="font-medium whitespace-nowrap text-text-primary">
                          ${typeof item.amount === 'number' ? item.amount.toFixed(2) : '0.00'}
                        </span>
                      </div>
                    ))}
                    {invoice.lineItems?.length > 2 && (
                      <p className="text-xs text-text-secondary italic pt-1">
                        +{invoice.lineItems.length - 2} more item{invoice.lineItems.length - 2 > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex-shrink-0 text-right">
                  <div className="mb-4 bg-success bg-opacity-10 rounded-lg p-3">
                    <p className="text-xs text-success font-semibold mb-1">Total Amount</p>
                    <p className="text-2xl font-bold text-success">
                      ${typeof invoice.totalAmount === 'number' ? invoice.totalAmount.toFixed(2) : '0.00'}
                    </p>
                  </div>

                  <div className="flex flex-col space-y-2 w-44">
                    {/* View Details Button */}
                    <button
                      onClick={() => setViewingInvoice(invoice)}
                      className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>View Details</span>
                    </button>

                    {/* Download PDF Button */}
                    <button
                      onClick={() => handleDownloadInvoice(invoice._id, invoice.invoiceNumber)}
                      className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-opacity-90 transition-all text-sm shadow-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Download</span>
                    </button>

                    {/* FREELANCER ACTIONS - Draft invoices */}
                    {invoice.status === 'Draft' && isFreelancer && (
                      <>
                        {/* Edit Button */}
                        <button
                          onClick={() => setEditingInvoice(invoice)}
                          className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all text-sm shadow-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span>Edit</span>
                        </button>

                        {/* Send Invoice Button */}
                        <button
                          onClick={() => {
                            if (window.confirm('Send this invoice to the client? They will be notified and can proceed with payment.')) {
                              handleSendInvoice(invoice._id);
                            }
                          }}
                          className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-success text-white rounded-lg font-medium hover:bg-opacity-90 transition-all text-sm shadow-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span>Send</span>
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteInvoice(invoice._id, invoice.invoiceNumber)}
                          className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-danger text-white rounded-lg font-medium hover:bg-opacity-90 transition-all text-sm shadow-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>Delete</span>
                        </button>
                      </>
                    )}

                    {/* CLIENT ACTIONS - Sent invoices (Pay Now) */}
                    {invoice.status === 'Sent' && !isFreelancer && (
                      <button
                        onClick={() => {
                          setSelectedInvoice(invoice);
                          setShowPaymentModal(true);
                        }}
                        className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-success text-white rounded-lg font-medium hover:bg-opacity-90 transition-all text-sm shadow-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        <span>Pay Now</span>
                      </button>
                    )}

                    {/* CLIENT ACTIONS - Paid invoices (Delete) */}
                    {invoice.status === 'Paid' && !isFreelancer && (
                      <button
                        onClick={() => handleDeleteInvoice(invoice._id, invoice.invoiceNumber)}
                        className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-danger text-white rounded-lg font-medium hover:bg-opacity-90 transition-all text-sm shadow-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Invoice Modal */}
      {isCreateModalOpen && (
        <CreateInvoiceModal
          projectId={projectId}
          projectName={projectName}
          onClose={() => setIsCreateModalOpen(false)}
          onInvoiceCreated={handleInvoiceCreated}
        />
      )}

      {/* Edit Invoice Modal */}
      {editingInvoice && (
        <CreateInvoiceModal
          projectId={projectId}
          projectName={projectName}
          editMode={true}
          existingInvoice={editingInvoice}
          onClose={() => setEditingInvoice(null)}
          onInvoiceCreated={handleInvoiceUpdated}
        />
      )}

      {/* Invoice Details Modal */}
      {viewingInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl animate-slideUp max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-success bg-opacity-10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-text-primary">Invoice Details</h2>
                  <p className="text-sm text-text-secondary">{viewingInvoice.invoiceNumber}</p>
                </div>
              </div>
              <button
                onClick={() => setViewingInvoice(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Invoice Content */}
            <div className="p-6 space-y-6">
              {/* Status Badge */}
              <div className="flex justify-between items-center">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadge(viewingInvoice.status)}`}>
                  {viewingInvoice.status}
                </span>
                <div className="text-right">
                  <p className="text-sm text-text-secondary">Issue Date</p>
                  <p className="text-base font-semibold text-text-primary">
                    {new Date(viewingInvoice.issueDate || viewingInvoice.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Billing Information */}
              <div className="grid grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="text-sm font-semibold text-text-secondary mb-2">Billed To:</h3>
                  <p className="font-bold text-text-primary">{viewingInvoice.clientName}</p>
                  <p className="text-sm text-text-secondary">{projectName}</p>
                </div>
                <div className="text-right">
                  <h3 className="text-sm font-semibold text-text-secondary mb-2">From:</h3>
                  <p className="font-bold text-text-primary">Freelancer</p>
                  <p className="text-sm text-text-secondary">Project Services</p>
                </div>
              </div>

              {/* Line Items */}
              <div>
                <h3 className="text-sm font-semibold text-text-primary mb-3">Items</h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-text-primary">Description</th>
                        <th className="text-right px-4 py-3 text-sm font-semibold text-text-primary">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {viewingInvoice.lineItems?.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-text-primary">{item.description}</td>
                          <td className="px-4 py-3 text-sm font-medium text-text-primary text-right">
                            ${typeof item.amount === 'number' ? item.amount.toFixed(2) : '0.00'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total */}
              <div className="border-t-2 border-gray-300 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-text-primary">Total Amount:</span>
                  <span className="text-3xl font-bold text-success">
                    ${typeof viewingInvoice.totalAmount === 'number' ? viewingInvoice.totalAmount.toFixed(2) : '0.00'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-4">
                {/* Download PDF Button */}
                <button
                  onClick={() => handleDownloadInvoice(viewingInvoice._id, viewingInvoice.invoiceNumber)}
                  className="flex-1 min-w-[150px] px-4 py-3 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium flex items-center justify-center space-x-2 shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Download PDF</span>
                </button>
                
                {/* FREELANCER ACTIONS - Draft invoices */}
                {viewingInvoice.status === 'Draft' && isFreelancer && (
                  <>
                    {/* Edit Button */}
                    <button
                      onClick={() => {
                        setEditingInvoice(viewingInvoice);
                        setViewingInvoice(null);
                      }}
                      className="flex-1 min-w-[150px] px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center justify-center space-x-2 shadow-sm"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>Edit Invoice</span>
                    </button>

                    {/* Send Invoice button */}
                    <button
                      onClick={() => {
                        if (window.confirm('Send this invoice to the client? They will be notified and can proceed with payment.')) {
                          handleSendInvoice(viewingInvoice._id);
                        }
                      }}
                      className="flex-1 min-w-[150px] px-4 py-3 bg-success text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium flex items-center justify-center space-x-2 shadow-sm"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>Send to Client</span>
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => {
                        handleDeleteInvoice(viewingInvoice._id, viewingInvoice.invoiceNumber);
                      }}
                      className="flex-1 min-w-[150px] px-4 py-3 bg-danger text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium flex items-center justify-center space-x-2 shadow-sm"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Delete</span>
                    </button>
                  </>
                )}
                
                {/* CLIENT ACTIONS - Sent invoices (Pay Now) */}
                {viewingInvoice.status === 'Sent' && !isFreelancer && (
                  <button
                    onClick={() => {
                      setSelectedInvoice(viewingInvoice);
                      setShowPaymentModal(true);
                      setViewingInvoice(null);
                    }}
                    className="flex-1 min-w-[150px] px-4 py-3 bg-success text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium flex items-center justify-center space-x-2 shadow-sm"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span>Pay Now</span>
                  </button>
                )}

                {/* CLIENT ACTIONS - Paid invoices (Delete) */}
                {viewingInvoice.status === 'Paid' && !isFreelancer && (
                  <button
                    onClick={() => {
                      handleDeleteInvoice(viewingInvoice._id, viewingInvoice.invoiceNumber);
                    }}
                    className="flex-1 min-w-[150px] px-4 py-3 bg-danger text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium flex items-center justify-center space-x-2 shadow-sm"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Delete Invoice</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal - We'll create this next */}
      {showPaymentModal && selectedInvoice && (
        <PaymentModal
          invoice={selectedInvoice}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedInvoice(null);
          }}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default InvoiceList;
