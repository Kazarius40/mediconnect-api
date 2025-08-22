import './style.css';

export type EntityType = 'doctor' | 'clinic' | 'service';

interface ConfirmModalProps {
  entity: { id: number; name: string };
  entityType: EntityType;
  onConfirm: (id: number) => void;
  onCancel: () => void;
}

const entityLabels: Record<EntityType, string> = {
  doctor: 'doctor',
  clinic: 'clinic',
  service: 'service',
};

export function ConfirmModal({
  entity,
  entityType,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const label = entityLabels[entityType];

  return (
    <div className="confirm-modal-overlay">
      <div className="confirm-modal-box">
        <h2 className="confirm-modal-title">Confirm deletion</h2>
        <p className="confirm-modal-text">
          Are you sure you want to delete {label} "{entity.name}"? This action
          cannot be undone.
        </p>
        <div className="confirm-modal-actions">
          <button onClick={onCancel} className="confirm-modal-btn-cancel">
            Cancel
          </button>
          <button
            onClick={() => onConfirm(entity.id)}
            className="confirm-modal-btn-delete"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
