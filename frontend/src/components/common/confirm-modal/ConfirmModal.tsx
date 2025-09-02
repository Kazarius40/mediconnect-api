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
    <div className="confirm-modal">
      <div>
        <h2>Confirm deletion</h2>
        <p>
          Are you sure you want to delete {label} "{entity.name}"? This action
          cannot be undone.
        </p>
        <div className="confirm-modal__actions">
          <button onClick={onCancel} className="btn-cancel">
            Cancel
          </button>
          <button onClick={() => onConfirm(entity.id)} className="btn-delete">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
