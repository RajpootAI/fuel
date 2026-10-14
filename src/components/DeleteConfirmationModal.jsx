import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function DeleteConfirmationModal({ 
  isOpen, 
  title, 
  message, 
  itemName, 
  onConfirm, 
  onCancel 
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <div className="modal-header">
          <div className="modal-title" style={{ color: '#991B1B' }}>
            <AlertTriangle size={20} style={{ color: '#EF4444' }} />
            {title || 'Confirm Deletion'}
          </div>
          <button className="modal-close-btn" onClick={onCancel}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
            {message || 'Are you sure you want to delete this record? This action cannot be undone.'}
          </p>
          {itemName && (
            <div 
              style={{ 
                padding: '12px 14px', 
                backgroundColor: '#F8FAFC', 
                border: '1px solid var(--border-color)', 
                borderRadius: '8px',
                fontWeight: 700,
                color: 'var(--text-main)',
                fontSize: '0.92rem'
              }}
            >
              {itemName}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button 
            className="btn-primary" 
            onClick={onConfirm}
            style={{ 
              background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
              boxShadow: '0 2px 4px rgba(220, 38, 38, 0.3)'
            }}
          >
            Delete Record
          </button>
        </div>
      </div>
    </div>
  );
}
