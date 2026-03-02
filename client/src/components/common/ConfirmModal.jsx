function ConfirmModal({ isOpen, onClose, onConfirm, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="card w-96">
        <h2 className="title-md mb-4">Confirm Action</h2>
        <p className="text-muted mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <button className="btn-danger" onClick={onConfirm}>
            Confirm
          </button>
          <button className="btn-primary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;