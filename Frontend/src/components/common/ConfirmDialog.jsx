import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ show, onClose, onConfirm, title, message, confirmText = 'Confirm', danger = false, loading }) {
  return (
    <Modal show={show} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center text-center pt-2 pb-6">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${danger ? 'bg-red-950/50 text-red-500' : 'bg-amber-950/50 text-amber-500'}`}>
          <AlertTriangle className="w-8 h-8" />
        </div>
        <p className="text-red-200/80 text-sm mb-6">{message}</p>
        <div className="flex gap-3 w-full">
          <Button variant="secondary" className="flex-1" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant={danger ? 'danger' : 'primary'} className="flex-1" onClick={onConfirm} loading={loading}>
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
